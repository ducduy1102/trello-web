import { cardModel } from "~/models/cardModel";

const createNew = async (data) => {
  try {
    const newCard = {
      ...data,
    };
    // Gọi tới model để xử lý lưu bản ghi newCard vào trong database
    const createdCard = await cardModel.createNew(newCard);

    // Lấy bản ghi Card sau khi tạo
    const getNewCard = await cardModel.findCardById(createdCard.insertedId);
    return getNewCard;
  } catch (error) {
    throw Error(error);
  }
};

export const cardService = {
  createNew,
};
