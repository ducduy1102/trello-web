import { StatusCodes } from "http-status-codes";
import multer from "multer";
import ApiError from "~/utils/ApiError";
import {
  ALLOW_COMMON_FILE_TYPES,
  LIMIT_COMMON_FILE_SIZE,
} from "~/utils/validators";

// https://www.npmjs.com/package/multer

// Check file is accepted
const customFileFilter = (req, file, callback) => {
  // console.log("🚀 ~ customFileFilter ~ file:", file);
  //   For multer check file using mimetype
  if (!ALLOW_COMMON_FILE_TYPES.includes(file.mimetype)) {
    const errMessage = "File type is invalid. Only accept jpg, jpeg and png";
    return callback(
      new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errMessage),
      null
    );
  }
  // File valid
  return callback(null, true);
};

// Initialize the file upload function wrapped by multer
const upload = multer({
  limits: {
    fileSize: LIMIT_COMMON_FILE_SIZE,
  },

  fileFilter: customFileFilter,
});

export const multerUploadMiddleware = { upload };
