import bcryptjs from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import { userModel } from "~/models/userModel";
import ApiError from "~/utils/ApiError";
import { v4 as uuidv4 } from "uuid";
import { pickUser } from "~/utils/formatter";
import { WEBSITE_DOMAINS } from "~/utils/constants";
import { BrevoProvider } from "~/providers/BrevoProvider";

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
    const verificationLink = `${WEBSITE_DOMAINS}/account/verification?email=${getNewUser.email}&token=${getNewUser.verifyToken}`;
    const customSubject =
      "Trello DucDuy App: Please verify your email before using our services!";
    const htmlContent = `
      <h3>Here is your verification link:</h3> X
      <h3>${verificationLink}</h3>
      <h3>Sincerely, <br/> - Ducduydev - A Programmer </h3>
    `;

    // Call Provider send email
    await BrevoProvider.sendEmail(getNewUser.email, customSubject, htmlContent);

    // Return data to Controller
    return pickUser(getNewUser);
  } catch (error) {
    throw error;
  }
};

export const userService = {
  createNew,
};
