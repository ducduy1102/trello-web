import { StatusCodes } from "http-status-codes";
import { cloneDeep } from "lodash";
import { boardModel } from "~/models/boardModel";
import { cardModel } from "~/models/cardModel";
import { columnModel } from "~/models/columnModel";
import ApiError from "~/utils/ApiError";
import { slugify } from "~/utils/formatter";

const createNew = async (data) => {
  try {
    // Xử lý logic data
    const newBoard = {
      ...data,
      slug: slugify(data.title),
    };
    // Gọi tới model để xử lý lưu bản ghi newBoard vào trong database
    const createdBoard = await boardModel.createNew(newBoard);

    // Lấy bản ghi board sau khi tạo
    const getNewBoard = await boardModel.findBoardById(createdBoard.insertedId);
    return getNewBoard;
  } catch (error) {
    throw Error(error);
  }
};

const getDetails = async (boardId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const board = await boardModel.getDetails(boardId);
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Board not found!");
    }

    // B1. Deep clone board là tạo ra một cái mới để xử lý ko ảnh hưởng tới board ban đầu, tùy mục đích về sau cần clone deep hay ko
    const resBoard = cloneDeep(board);

    // B2. Đưa cards vào trong columns
    resBoard.columns.forEach((column) => {
      // C1. convert ObjectId() về string bằng hàm toString() trong js
      // column.cards = resBoard.cards.filter(
      //   (card) => card.columnId.toString() === column._id.toString()
      // );

      // C2: Dùng .equals vì mongoDB có support medthod .equals
      column.cards = resBoard.cards.filter((card) =>
        card.columnId.equals(column._id)
      );
    });

    // Xóa mảng cards khỏi board ban đầu
    delete resBoard.cards;

    return resBoard;
  } catch (error) {
    throw error;
  }
};

const update = async (boardId, data) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const updatedData = {
      ...data,
      updatedAt: Date.now(),
    };

    const updatedBoard = await boardModel.update(boardId, updatedData);

    return updatedBoard;
  } catch (error) {
    throw error;
  }
};

const moveCardToDifferentColumn = async (data) => {
  // eslint-disable-next-line no-useless-catch
  try {
    // Di chuyển card khác column
    /**
     * Flow
     * B1. Cập nhật mảng "cardOrderIds" của "column ban đầu" (tức là xóa _id của card vừa di chuyển sang column khác)
     * B2. Cập nhật mảng "cardOrderIds" của "column mới" (tức là thêm _id của card vừa di chuyển ở column mới)
     * B3. Cập nhật lại trường "columnId" của "card đã kéo"
     * => Viết 1 API làm việc này
     */
    await columnModel.update(data.prevColumnId, {
      cardOrderIds: data.prevCardOrderIds,
      updatedAt: Date.now(),
    });

    await columnModel.update(data.nextColumnId, {
      cardOrderIds: data.nextCardOrderIds,
      updatedAt: Date.now(),
    });

    await cardModel.update(data.currentCardId, {
      columnId: data.nextColumnId,
    });

    return { updateResult: "Successfully!" };
  } catch (error) {
    throw error;
  }
};

export const boardService = {
  createNew,
  getDetails,
  update,
  moveCardToDifferentColumn,
};
