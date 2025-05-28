import Joi from "joi";
import { ObjectId } from "mongodb";
import { GET_DB } from "~/config/mongodb";
import { BOARD_TYPES } from "~/utils/constants";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~/utils/validators";
import { columnModel } from "./columnModel";
import { cardModel } from "./cardModel";
import { pagingSkipValue } from "~/utils/algorithms";

// Define Collection (name & schema)
const BOARD_COLLECTION_NAME = "boards";
const BOARD_COLLECTION_SCHEMA = Joi.object({
  title: Joi.string().required().min(3).max(50).trim().strict(),
  slug: Joi.string().required().min(3).trim().strict(),
  description: Joi.string().required().min(3).max(256).trim().strict(),
  type: Joi.string()
    .valid(...Object.values(BOARD_TYPES))
    .required(),

  // Các item trong mảng columnOrderIds là ObjectId nên cần thêm pattern cho chuẩn
  columnOrderIds: Joi.array()
    .items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
    .default([]),
  // Admin board
  ownerIds: Joi.array()
    .items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
    .default([]),

  // Members of board
  memberIds: Joi.array()
    .items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
    .default([]),

  createdAt: Joi.date().timestamp("javascript").default(Date.now),
  updatedAt: Joi.date().timestamp("javascript").default(null),
  _destroy: Joi.boolean().default(false),
});

// Chỉ ra những field ko cho phép cập nhật trong hàm update
const INVALID_UPDATE_FIELDS = ["_id", "createdAt"];

const validateBeforeCreate = async (data) => {
  return await BOARD_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false,
  });
};

const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data);
    const createdBoard = await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .insertOne(validData);
    return createdBoard;
  } catch (error) {
    throw new Error(error);
  }
};

const findBoardById = async (boardId) => {
  try {
    const result = await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(boardId) });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

// Query tổng hợp (aggregate) để lấy toàn bộ Columns và Cards thuộc về Board
const getDetails = async (id) => {
  try {
    // const result = await GET_DB()
    //   .collection(BOARD_COLLECTION_NAME)
    //   .findOne({ _id: new ObjectId(id) });
    const result = await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .aggregate([
        {
          $match: {
            _id: new ObjectId(id),
            _destroy: false,
          },
        },
        {
          $lookup: {
            from: columnModel.COLUMN_COLLECTION_NAME,
            localField: "_id",
            foreignField: "boardId",
            as: "columns",
          },
        },
        {
          $lookup: {
            from: cardModel.CARD_COLLECTION_NAME,
            localField: "_id",
            foreignField: "boardId",
            as: "cards",
          },
        },
      ])
      .toArray();

    return result[0] || null;
  } catch (error) {
    throw new Error(error);
  }
};

// Push columnId vào cuối mảng columnOrderIds
// Đẩy 1 phẩn tử columnId vào cuối mảng columnOrderIds
// Dùng $push trong mongoDB ở case này để thêm 1 ptu vào cuối
const pushColumnOrderIds = async (column) => {
  try {
    const result = await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .findOneAndUpdate(
        // filter
        { _id: new ObjectId(column.boardId) },
        // update
        { $push: { columnOrderIds: new ObjectId(column._id) } },
        // options: "after" returns the updated document
        { returnDocument: "after" }
      );

    return result;
  } catch (error) {
    throw new Error(error);
  }
};

// Lấy 1 phẩn tử columnId ra khỏi mảng columnOrderIds
// Dùng $pull trong mongoDB ở case này để lấy 1 ptu ra khỏi mảng rồi xóa nó
const pullColumnOrderIds = async (column) => {
  try {
    const result = await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .findOneAndUpdate(
        // filter
        { _id: new ObjectId(column.boardId) },
        // update
        { $pull: { columnOrderIds: new ObjectId(column._id) } },
        // options: "after" returns the updated document
        { returnDocument: "after" }
      );

    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const update = async (boardId, updateData) => {
  try {
    // Lọc những field ko cho phép cập nhật
    Object.keys(updateData).forEach((fieldName) => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
        delete updateData(fieldName);
      }
    });

    // Đối với dữ liệu liên quan đến ObjectId, biến đổi ở đây
    if (updateData.columnOrderIds) {
      updateData.columnOrderIds = updateData.columnOrderIds.map(
        (_id) => new ObjectId(_id)
      );
    }

    const result = await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .findOneAndUpdate(
        // filter
        { _id: new ObjectId(boardId) },
        // update
        { $set: updateData },
        // options: "after" returns the updated document
        { returnDocument: "after" }
      );

    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const getBoards = async (userId, page, itemsPerPage) => {
  try {
    const queryCondition = [
      // Điều kiện 01: Board chưa bị xóa
      { _destroy: false },
      // Điều kiện 2: userId đang thực hiện req này phải thuộc 1 trong 2 mảng ownerIds (admin board) hoặc memberIds (thành viên của board) => use toán tử $all của mongodb
      // https://www.mongodb.com/docs/v6.0/reference/operator/query/all/
      {
        $or: [
          {
            ownerIds: { $all: [new ObjectId(userId)] },
          },
          {
            memberIds: { $all: [new ObjectId(userId)] },
          },
        ],
      },
    ];

    const query = await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .aggregate(
        [
          { $match: { $and: queryCondition } },
          // sort title A -> Z (mặc định B đứng trước a thường theo chuẩn bảng mã ASCII)
          { $sort: { title: 1 } },
          // facet: xử lý nhiều luồng trong 1 query
          {
            $facet: {
              // Luồng thứ nhất: Query boards
              queryBoards: [
                { $skip: pagingSkipValue(page, itemsPerPage) }, // Bỏ qua số lượng bản ghi của những page trước đó
                { $limit: itemsPerPage }, // Giới hạn số lượng bản ghi trong 1 page
              ],
              // Luồng thứ hai: Query đếm tổng tất cả số lượng bản ghi board trong DB và trả về biến countedAllBoards
              queryTotalBoards: [
                {
                  $count: "countedAllBoards",
                },
              ],
            },
          },
        ],
        {
          // Khai báo thêm thuộc tính collaction locale 'en' để fix 'B' và 'a'
          // https://www.mongodb.com/docs/v6.0/reference/collation/
          collation: { locale: "en" },
        }
      )
      .toArray();
    // console.log("🚀 ~ getBoards ~ query:", query);
    const res = query[0];
    // console.log("🚀 ~ getBoards ~ res:", res);

    return {
      boards: res.queryBoards || [],
      totalBoards: res.queryTotalBoards[0]?.countedAllBoards || 0,
    };
  } catch (error) {
    throw new Error(error);
  }
};

export const boardModel = {
  BOARD_COLLECTION_NAME,
  BOARD_COLLECTION_SCHEMA,
  createNew,
  findBoardById,
  getDetails,
  pushColumnOrderIds,
  pullColumnOrderIds,
  update,
  getBoards,
};
