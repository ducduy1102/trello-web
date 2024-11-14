import { slugify } from "~/utils/formatter";

const createNew = async (data) => {
  try {
    // Xử lý logic data
    const newBoard = {
      ...data,
      slug: slugify(data.title),
    };
    return newBoard;
  } catch (error) {
    throw Error(error);
  }
};

export const boardService = {
  createNew,
};
