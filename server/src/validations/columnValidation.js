import { StatusCodes } from "http-status-codes";
import Joi from "joi";
import ApiError from "~/utils/ApiError";
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from "~/utils/validators";

const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    boardId: Joi.string()
      .required()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE),
    title: Joi.string().required().min(3).max(50).trim().strict().messages({
      "any.required": "Title is required",
      "string.empty": "Title is not allowed to be empty",
      "string.min": "Title length must be at least 3 characters long",
      "string.max":
        "Title length must be less than or equal to 50 characters long",
      "string.trim": "Title must not have leading or trailing whitespace",
    }),
  });
  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    next(
      new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message)
    );
  }
};

const update = async (req, res, next) => {
  // Ko required trong case update
  const correctCondition = Joi.object({
    // update boardId khi có tính năng di chuyển column sang board khác
    // boardId: Joi.string()
    //   .pattern(OBJECT_ID_RULE)
    //   .message(OBJECT_ID_RULE_MESSAGE),
    title: Joi.string().min(3).max(50).trim().strict().messages({
      "any.required": "Title is required",
      "string.empty": "Title is not allowed to be empty",
      "string.min": "Title length must be at least 3 characters long",
      "string.max":
        "Title length must be less than or equal to 50 characters long",
      "string.trim": "Title must not have leading or trailing whitespace",
    }),
    cardOrderIds: Joi.array().items(
      Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
    ),
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

export const columnValidation = {
  createNew,
  update,
};
