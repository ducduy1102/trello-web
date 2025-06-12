import { cardModel } from "~/models/cardModel";
import { columnModel } from "~/models/columnModel";
import { CloudinaryProvider } from "~/providers/CloudinaryProvider";

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

const update = async (cardId, reqBody, cardCoverFile, userInfo) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now(),
    };
    let updatedCard = {};
    if (cardCoverFile) {
      // Case upload file to cloud storage (Cloudinary)
      const uploadResult = await CloudinaryProvider.streamUpload(
        cardCoverFile.buffer,
        "card-covers"
      );

      // Save url image into db
      updatedCard = await cardModel.update(cardId, {
        cover: uploadResult.secure_url,
      });
    } else if (updateData.commentToAdd) {
      // Create comment data in db
      const commentData = {
        ...updateData.commentToAdd,
        userId: userInfo._id,
        userEmail: userInfo.email,
        commentedAt: Date.now(),
      };
      updatedCard = await cardModel.unshiftNewComment(cardId, commentData);
    } else if (updateData.incomingMemberInfo) {
      // Case ADD or REMOVE members from the Card
      updatedCard = await cardModel.updateMembers(
        cardId,
        updateData.incomingMemberInfo
      );
    } else {
      // Case update general information ex: displayName
      updatedCard = await cardModel.update(cardId, updateData);
    }

    return updatedCard;
  } catch (error) {
    throw error;
  }
};

export const cardService = {
  createNew,
  update,
};
