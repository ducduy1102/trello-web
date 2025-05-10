import bcryptjs from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import { userModel } from "~/models/userModel";
import ApiError from "~/utils/ApiError";
import { v4 as uuidv4 } from "uuid";
import { pickUser } from "~/utils/formatter";

const createNew = async (reqBody) => {
  try {
    // Check if email exists in the system
    const existUser = await userModel.findOneByEmail(reqBody.email);
    if (existUser) {
      throw new ApiError(StatusCodes.CONFLICT, "Email already exists!");
    }

    // Create data to save into database
    const nameFromEmail = reqBody.email.split("@")[0]; // ex: admin@gmail.com => admin
    const newUser = {
      email: reqBody.email,
      password: bcryptjs.hashSync(reqBody.password, 8), // The second parameter is complexity, the higher the value, the longer the hashing takes.
      username: nameFromEmail,
      displayName: nameFromEmail, // default same as user name when user registers
      verifyToken: uuidv4(),
    };

    // Save to database
    const createdUser = await userModel.createNew(newUser);
    const getNewUser = await userModel.findOneById(createdUser.insertedId);

    // Send email to verify account
    // Return data to Controller
    return pickUser(getNewUser);
  } catch (error) {
    throw error;
  }
};

export const userService = {
  createNew,
};
