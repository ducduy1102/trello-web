import Joi from "joi";
import { ObjectId } from "mongodb";
import { GET_DB } from "~/config/mongodb";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~/utils/validators";

// Define Collection (name & schema)
const COLUMN_COLLECTION_NAME = "columns";
const COLUMN_COLLECTION_SCHEMA = Joi.object({
  columnId: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),
  title: Joi.string().required().min(3).max(50).trim().strict(),

  // Các item trong mảng cardOrderIds là ObjectId nên cần thêm pattern cho chuẩn
  cardOrderIds: Joi.array()
    .items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
    .default([]),

  createdAt: Joi.date().timestamp("javascript").default(Date.now),
  updatedAt: Joi.date().timestamp("javascript").default(null),
  _destroy: Joi.boolean().default(false),
});

// Chỉ ra những field ko cho phép cập nhật trong hàm update
const INVALID_UPDATE_FIELDS = ["_id", "boardId", "createdAt"];

const validateBeforeCreate = async (data) => {
  return await COLUMN_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false,
  });
};

const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data);
    // Convert 1 số dữ liệu liên quan đến ObjectId
    const newColumnToAdd = {
      ...validData,
      columnId: new ObjectId(validData.columnId),
    };
    const createdBoard = await GET_DB()
      .collection(COLUMN_COLLECTION_NAME)
      .insertOne(newColumnToAdd);
    return createdBoard;
  } catch (error) {
    throw new Error(error);
  }
};

const findColumnById = async (id) => {
  try {
    const result = await GET_DB()
      .collection(COLUMN_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(id) });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

// Push cardId vào cuối mảng cardOrderIds
const pushCardOrderIds = async (card) => {
  try {
    const result = await GET_DB()
      .collection(COLUMN_COLLECTION_NAME)
      .findOneAndUpdate(
        // filter
        { _id: new ObjectId(card.columnId) },
        // update
        { $push: { cardOrderIds: new ObjectId(card._id) } },
        // options: "after" returns the updated document
        { returnDocument: "after" }
      );

    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const update = async (columnId, updateData) => {
  try {
    // Lọc những field ko cho phép cập nhật
    Object.keys(updateData).forEach((fieldName) => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
        delete updateData(fieldName);
      }
    });

    // Đối với dữ liệu liên quan đến ObjectId, biến đổi ở đây
    if (updateData.cardOrderIds) {
      updateData.cardOrderIds = updateData.cardOrderIds.map(
        (_id) => new ObjectId(_id)
      );
    }

    const result = await GET_DB()
      .collection(COLUMN_COLLECTION_NAME)
      .findOneAndUpdate(
        // filter
        { _id: new ObjectId(columnId) },
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

export const columnModel = {
  COLUMN_COLLECTION_NAME,
  COLUMN_COLLECTION_SCHEMA,
  createNew,
  findColumnById,
  pushCardOrderIds,
  update,
};
