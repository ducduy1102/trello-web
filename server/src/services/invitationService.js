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

const updateBoardInvitation = async (userId, invitationId, status) => {
  try {
    // Tìm bản ghi invitation trong model
    const getInvitation = await invitationModel.findOneById(invitationId);
    if (!getInvitation)
      throw new ApiError(StatusCodes.NOT_FOUND, "Invitation not found!");

    // Sau khi có Invitaion rồi thì lấy full thông tin của board
    const boardId = getInvitation.boardInvitation.boardId;
    const getBoard = await boardModel.findBoardById(boardId);
    if (!getBoard)
      throw new ApiError(StatusCodes.NOT_FOUND, "Board not found!");

    // Kiểm tra xem nếu status là ACCEPTED join board mà cái thằng user (invitee) đã là owner hoặc member của board rồi thì trả về thông báo lỗi luôn.
    // Note: 2 mảng memberIds và ownerIds của board nó đang là kiểu dữ liệu ObjectId nên cho nó về String hết
    const boardOwnerAndMemberIds = [
      ...getBoard.ownerIds,
      ...getBoard.memberIds,
    ].toString();

    if (
      status === BOARD_INVITATION_STATUS.ACCEPTED &&
      boardOwnerAndMemberIds.includes(userId)
    ) {
      throw new ApiError(
        StatusCodes.NOT_ACCEPTABLE,
        "You are already a member of this board!"
      );
    }

    // Tạo dữ liệu để update bản ghi Invitation
    const updateData = {
      boardInvitation: {
        ...getInvitation.boardInvitation,
        status: status, // status from ACCEPTED or REJECTED from FE push
      },
    };

    // Bước 1: Cập nhật status trong bản ghi Invitation
    const updatedInvitation = await invitationModel.update(
      invitationId,
      updateData
    );

    // Bước 2: Nếu trường hợp Accept một lời mời thành công, thì cần phải thêm thông tin của thằng user (userId) vào bản ghi memberIds trong collection board.
    if (
      updatedInvitation.boardInvitation.status ===
      BOARD_INVITATION_STATUS.ACCEPTED
    ) {
      await boardModel.pushMemberIds(boardId, userId);
    }

    return updatedInvitation;
  } catch (error) {
    throw error;
  }
};
export const invitationService = {
  createNewBoardInvitation,
  getInvitations,
  updateBoardInvitation,
};
