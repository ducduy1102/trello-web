import { StatusCodes } from "http-status-codes";
import { boardModel } from "~/models/boardModel";
import { userModel } from "~/models/userModel";
import { invitationModel } from "~/models/invitationModel";
import ApiError from "~/utils/ApiError";
import { INVITATION_TYPES, BOARD_INVITATION_STATUS } from "~/utils/constants";
import { pickUser } from "~/utils/formatter";

const createNewBoardInvitation = async (reqBody, inviterId) => {
  try {
    // Inviter: là người đi mời - người đang req, vì vậy chúng ta tìm kiếm theo id lấy từ token
    const inviter = await userModel.findOneById(inviterId);
    // Invitee: người được mời lấy theo email nhận từ phía FE
    const invitee = await userModel.findOneByEmail(reqBody.inviteeEmail);
    // Tìm board để lấy data xử lý
    const board = await boardModel.findBoardById(reqBody.boardId);

    // Nếu không có cái nào trong 3 cái đó tồn tại => reject
    if (!invitee || !inviter || !board) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        "Inviter, Invitee or Board not found!"
      );
    }

    // Tạo data để lưu vào db
    const newInvitationData = {
      inviterId,
      inviteeId: invitee._id.toString(), // chuyển từ ObjectId() -> String vì sang bên Model có check lại
      type: INVITATION_TYPES.BOARD_INVITATION,
      boardInvitation: {
        boardId: board._id.toString(),
        status: BOARD_INVITATION_STATUS.PENDING, // default: pending
      },
    };

    // Gọi sang model để lưu vào DB
    const createdInvitation = await invitationModel.createNewBoardInvitation(
      newInvitationData
    );
    const getInvitation = await invitationModel.findOneById(
      createdInvitation.insertedId
    );

    // Ngoài thông tin của board invitation mới tạo thì trả đủ về luôn cả board, inviter, invitee cho FE xử lý thoải mái.
    const resInvitation = {
      ...getInvitation,
      board,
      inviter: pickUser(inviter),
      invitee: pickUser(invitee),
    };

    return resInvitation;
  } catch (error) {
    throw error;
  }
};

const getInvitations = async (userId) => {
  try {
    const getInvitations = await invitationModel.findByUser(userId);
    // console.log("🚀 ~ getInvitations ~ getInvitations:", getInvitations);
    // Vì các dữ liệu inviter, invitee và board là đang ở giá trị màng 1 phần tử nếu lấy ra được nên chúng ta biến đổi nó về Json Object trước khi trả về cho phía FE
    const resInvitations = getInvitations.map((i) => ({
      ...i,
      inviter: i.inviter[0] || {},
      invitee: i.invitee[0] || {},
      board: i.board[0] || {},
    }));

    return resInvitations;
  } catch (error) {
    throw error;
  }
};

export const invitationService = {
  createNewBoardInvitation,
  getInvitations,
};
