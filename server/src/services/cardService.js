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

export const cardService = {
  createNew,
};
