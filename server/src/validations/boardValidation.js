import { StatusCodes } from "http-status-codes";
import Joi from "joi";
import ApiError from "~/utils/ApiError";
import { BOARD_TYPES } from "~/utils/constants";

const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    title: Joi.string().required().min(3).max(50).trim().strict().messages({
      "any.required": "Title is required",
      "string.empty": "Title is not allowed to be empty",
      "string.min": "Title length must be at least 3 characters long",
      "string.max":
        "Title length must be less than or equal to 50 characters long",
      "string.trim": "Title must not have leading or trailing whitespace",
    }),
    description: Joi.string().required().min(3).max(256).trim().strict(),
    type: Joi.string()
      .valid(...Object.values(BOARD_TYPES))
      .required(),
  });
  try {
    // set abortEarly: false case có nhiều lỗi validation thì return all error
    await correctCondition.validateAsync(req.body, { abortEarly: false });
    // Validate data hợp lệ => request => controller / middleware
    next();
  } catch (error) {
    const errorMessage = new Error(error).message;
    const customError = new ApiError(
      StatusCodes.UNPROCESSABLE_ENTITY,
      errorMessage
    );
    next(customError);
  }
};

const update = async (req, res, next) => {
  // Ko required trong case update
  const correctCondition = Joi.object({
    title: Joi.string().min(3).max(50).trim().strict().messages({
      "any.required": "Title is required",
      "string.empty": "Title is not allowed to be empty",
      "string.min": "Title length must be at least 3 characters long",
      "string.max":
        "Title length must be less than or equal to 50 characters long",
      "string.trim": "Title must not have leading or trailing whitespace",
    }),
    description: Joi.string().min(3).max(256).trim().strict(),
    type: Joi.string().valid(...Object.values(BOARD_TYPES)),
  });
  try {
    // set abortEarly: false case có nhiều lỗi validation thì return all error
    await correctCondition.validateAsync(req.body, {
      abortEarly: false,
      allowUnknown: true,
    });
    // Validate data hợp lệ => request => controller / middleware
    next();
  } catch (error) {
    const errorMessage = new Error(error).message;
    const customError = new ApiError(
      StatusCodes.UNPROCESSABLE_ENTITY,
      errorMessage
    );
    next(customError);
  }
};

export const boardValidation = {
  createNew,
  update,
};
