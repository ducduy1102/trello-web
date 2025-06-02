import Joi from "joi";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~/utils/validators";
import { INVITATION_TYPES, BOARD_INVITATION_STATUS } from "~/utils/constants";
import { ObjectId } from "mongodb";
import { GET_DB } from "~/config/mongodb";
import { userModel } from "~/models/userModel";
import { boardModel } from "~/models/boardModel";

// Define collection (name & schema)
const INVITATION_COLLECTION_NAME = "invitations";
const INVITATION_COLLECTION_SCHEMA = Joi.object({
  inviterId: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE), // Người đi mời
  inviteeId: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE), // Người được mời
  type: Joi.string()
    .required()
    .valid(...Object.values(INVITATION_TYPES)),

  // Nếu lời mời là board => lưu thêm dữ liệu boardInvitation - optional
  boardInvitation: Joi.object({
    boardId: Joi.string()
      .required()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE),
    status: Joi.string()
      .required()
      .valid(...Object.values(BOARD_INVITATION_STATUS)),
  }).optional(),

  createdAt: Joi.date().timestamp("javascript").default(Date.now),
  updatedAt: Joi.date().timestamp("javascript").default(null),
  _destroy: Joi.boolean().default(false),
});

// Chỉ định ra những field ko cho phép cập nhật trong hàm update
const INVALID_UPDATE_FIELDS = [
  "_id",
  "inviterId",
  "inviteeId",
  "type",
  "createdAt",
];

const validateBeforeCreate = async (data) => {
  return await INVITATION_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false,
  });
};

const createNewBoardInvitation = async (data) => {
  try {
    const validData = await validateBeforeCreate(data);
    // Chuyển đổi một số dữ liệu liên quan tới ObjectId chính xác
    let newInvitationToAdd = {
      ...validData,
      inviterId: new ObjectId(validData.inviterId),
      inviteeId: new ObjectId(validData.inviteeId),
    };

    // Nếu dữ liệu boardInvitation tồn tại => update boardId
    if (validData.boardInvitation) {
      newInvitationToAdd.boardInvitation = {
        ...validData.boardInvitation,
        boardId: new ObjectId(validData.boardInvitation.boardId),
      };
    }
    const createdInvitation = await GET_DB()
      .collection(INVITATION_COLLECTION_NAME)
      .insertOne(newInvitationToAdd);

    return createdInvitation;
  } catch (error) {
    throw new Error(error);
  }
};

const findOneById = async (invitationId) => {
  try {
    const result = await GET_DB()
      .collection(INVITATION_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(invitationId) });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const update = async (invitationId, updateData) => {
  try {
    // Lọc các trường không cho phép cập nhật
    Object.keys(updateData).forEach((fieldName) => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
        delete updateData[fieldName];
      }
    });

    // Đối với dữ liệu liên quan đến ObjectId, biến đổi ở đây
    if (updateData.boardInvitation) {
      updateData.boardInvitation = {
        ...updateData.boardInvitation,
        boardId: new ObjectId(updateData.boardInvitation.boardId),
      };
    }

    const result = await GET_DB()
      .collection(INVITATION_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(invitationId) },
        { $set: updateData },
        { returnDocument: "after" } // trả về kq sau khi update
      );

    return result;
  } catch (error) {
    throw new Error(error);
  }
};

// Query tổng hợp (aggregate) để lấy những bản ghi invitation thuộc về 1 user cụ thể
const findByUser = async (userId) => {
  try {
    // Tìm theo inviteeId - Người được mời chính là người đang thực hiện req này
    const queryCondition = [
      { inviteeId: new ObjectId(userId) },
      { _destroy: false },
    ];
    const results = await GET_DB()
      .collection(INVITATION_COLLECTION_NAME)
      .aggregate([
        { $match: { $and: queryCondition } },
        {
          $lookup: {
            from: userModel.USER_COLLECTION_NAME,
            localField: "inviterId", // Người mời
            foreignField: "_id",
            as: "inviter",
            pipeline: [{ $project: { password: 0, verifyToken: 0 } }],
          },
        },
        {
          $lookup: {
            from: userModel.USER_COLLECTION_NAME,
            localField: "inviteeId", // Người được mời
            foreignField: "_id",
            as: "invitee",
            pipeline: [{ $project: { password: 0, verifyToken: 0 } }],
          },
        },
        {
          $lookup: {
            from: boardModel.BOARD_COLLECTION_NAME,
            localField: "boardInvitation.boardId", // Thông tin board
            foreignField: "_id",
            as: "board",
          },
        },
      ])
      .toArray();

    return results;
  } catch (error) {
    throw new Error(error);
  }
};

export const invitationModel = {
  INVITATION_COLLECTION_NAME,
  INVITATION_COLLECTION_SCHEMA,
  createNewBoardInvitation,
  findOneById,
  update,
  findByUser,
};
