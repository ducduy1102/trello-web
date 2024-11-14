import { boardModel } from "~/models/boardModel";
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
    console.log(getNewBoard);
    return getNewBoard;
  } catch (error) {
    throw Error(error);
  }
};

export const boardService = {
  createNew,
};
