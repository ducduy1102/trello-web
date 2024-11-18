import { StatusCodes } from "http-status-codes";
import { columnService } from "~/services/columnService";
import ApiError from "~/utils/ApiError";

const createNew = async (req, res, next) => {
  try {
    const createdColumn = await columnService.createNew(req.body);

    res.status(StatusCodes.CREATED).json(createdColumn);
  } catch (error) {
    next(error);
  }
};

export const columnController = {
  createNew,
};
