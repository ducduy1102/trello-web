import { cardModel } from "~/models/cardModel";
import { columnModel } from "~/models/columnModel";

const createNew = async (data) => {
  try {
    const newCard = {
      ...data,
    };
    // Gọi tới model để xử lý lưu bản ghi newCard vào trong database
    const createdCard = await cardModel.createNew(newCard);

    // Lấy bản ghi Card sau khi tạo
    const getNewCard = await cardModel.findCardById(createdCard.insertedId);

    // Update lại mảng cardOrderIds trong collection Columns
    if (getNewCard) {
      await columnModel.pushCardOrderIds(getNewCard);
    }

    return getNewCard;
  } catch (error) {
    throw Error(error);
  }
};

const update = async (cardId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now(),
    };
    const updatedCard = await cardModel.update(cardId, updateData);
    return updatedCard;
  } catch (error) {
    throw error;
  }
};

export const cardService = {
  createNew,
  update,
};
