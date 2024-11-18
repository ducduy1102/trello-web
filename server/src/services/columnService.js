import { columnModel } from "~/models/columnModel";

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
    return getNewColumn;
  } catch (error) {
    throw Error(error);
  }
};

export const columnService = {
  createNew,
};
