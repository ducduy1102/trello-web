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
    const userId = req.jwtDecoded._id;

    // Điều hướng data tầng services
    const createdBoard = await boardService.createNew(userId, req.body);

    // throw new ApiError(StatusCodes.BAD_GATEWAY, "Test error!");

    // Kết quả trả về client
    res.status(StatusCodes.CREATED).json(createdBoard);
  } catch (error) {
    next(error);
  }
};

const getDetails = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id;
    const boardId = req.params.id;
    const board = await boardService.getDetails(userId, boardId);

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

const moveCardToDifferentColumn = async (req, res, next) => {
  try {
    const result = await boardService.moveCardToDifferentColumn(req.body);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

const getBoards = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id;
    // page and itemsPerPage are passed into the query url from FE side so BE will get it through req.query
    const { page, itemsPerPage, q } = req.query;
    const queryFilters = q;
    const results = await boardService.getBoards(
      userId,
      page,
      itemsPerPage,
      queryFilters
    );
    res.status(StatusCodes.OK).json(results);
  } catch (error) {
    next(error);
  }
};

export const boardController = {
  createNew,
  getDetails,
  update,
  moveCardToDifferentColumn,
  getBoards,
};
