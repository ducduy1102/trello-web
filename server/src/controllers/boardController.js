import { StatusCodes } from "http-status-codes";
import { boardService } from "~/services/boardService";
import ApiError from "~/utils/ApiError";

const createNew = async (req, res, next) => {
  try {
    // console.log("req.body: ", req.body);
    // console.log("req.query: ", req.query);
    // console.log("req.params: ", req.params);
    // console.log("req.files: ", req.files);
    // console.log("req.cookies: ", req.cookies);
    // console.log("req.jwtDecoded: ", req.jwtDecoded);

    // Điều hướng data tầng services
    const createdBoard = await boardService.createNew(req.body);

    // throw new ApiError(StatusCodes.BAD_GATEWAY, "Test error!");

    // Kết quả trả về client
    res.status(StatusCodes.CREATED).json(createdBoard);
  } catch (error) {
    next(error);
  }
};

const getDetails = async (req, res, next) => {
  try {
    // console.log("req.params: ", req.params);
    const boardId = req.params.id;
    const board = await boardService.getDetails(boardId);

    // Kết quả trả về client
    res.status(StatusCodes.OK).json(board);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    // console.log("req.params: ", req.params);
    const boardId = req.params.id;
    const updatedBoard = await boardService.update(boardId, req.body);

    // Kết quả trả về client
    res.status(StatusCodes.OK).json(updatedBoard);
  } catch (error) {
    next(error);
  }
};

export const boardController = {
  createNew,
  getDetails,
  update,
};
