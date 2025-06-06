import { StatusCodes } from "http-status-codes";
import { boardModel } from "~/models/boardModel";
import { cardModel } from "~/models/cardModel";
import { columnModel } from "~/models/columnModel";
import ApiError from "~/utils/ApiError";

const createNew = async (data) => {
  try {
    const newColumn = {
      ...data,
    };
    // Gọi tới model để xử lý lưu bản ghi newColumn vào trong database
    const createdColumn = await columnModel.createNew(newColumn);

    // Lấy bản ghi Column sau khi tạo
    const getNewColumn = await columnModel.findColumnById(
      createdColumn.insertedId
    );

    // Update lại mảng columnOrderIds trong collection Boards
    if (getNewColumn) {
      getNewColumn.cards = [];
      await boardModel.pushColumnOrderIds(getNewColumn);
    }

    return getNewColumn;
  } catch (error) {
    throw Error(error);
  }
};

const update = async (columnId, data) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const updatedData = {
      ...data,
      updatedAt: Date.now(),
    };

    const updatedColumn = await columnModel.update(columnId, updatedData);

    return updatedColumn;
  } catch (error) {
    throw error;
  }
};

const deleteItem = async (columnId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const targetColumn = await columnModel.findColumnById(columnId);

    // Xóa Column
    await columnModel.deleteColumnById(columnId);

    // Xóa Cards thuộc Column trên
    await cardModel.deleteManyByColumnId(columnId);

    // Xóa columnId trong mảng columnOrderIds của Boards
    await boardModel.pullColumnOrderIds(targetColumn);

    return { deleteResult: "Column and its Cards deleted successfully!" };
  } catch (error) {
    throw error;
  }
};

export const columnService = {
  createNew,
  update,
  deleteItem,
};
