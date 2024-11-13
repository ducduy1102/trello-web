import { StatusCodes } from "http-status-codes";
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

    // Kết quả trả về client
    // throw new ApiError(StatusCodes.BAD_GATEWAY, "Test error!");

    res
      .status(StatusCodes.CREATED)
      .json({ message: "POST from controllers: APIs create new board!" });
  } catch (error) {
    next(error);
  }
};

export const boardController = {
  createNew,
};
