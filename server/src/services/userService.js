import bcryptjs from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import { userModel } from "~/models/userModel";
import ApiError from "~/utils/ApiError";
import { v4 as uuidv4 } from "uuid";
import { pickUser } from "~/utils/formatter";
import { WEBSITE_DOMAINS } from "~/utils/constants";
import { BrevoProvider } from "~/providers/BrevoProvider";
import { env } from "~/config/environment";
import { JwtProvider } from "~/providers/JwtProvider";

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

const verifyAccount = async (reqBody) => {
  try {
    // Query user in database
    const existUser = await userModel.findOneByEmail(reqBody.email);

    if (!existUser)
      throw new ApiError(StatusCodes.NOT_FOUND, "Account not found!");

    if (existUser.isActive)
      throw new ApiError(
        StatusCodes.NOT_ACCEPTABLE,
        "Your account is already active"
      );

    if (reqBody.token !== existUser.verifyToken)
      throw new ApiError(StatusCodes.NOT_ACCEPTABLE, "Token is invalid");

    // Update user to verify account
    const updateData = {
      isActive: true,
      verifyToken: null,
    };
    const updatedUser = await userModel.update(existUser._id, updateData);

    return pickUser(updatedUser);
  } catch (error) {
    throw error;
  }
};

const login = async (reqBody) => {
  try {
    // Query user in database
    const existUser = await userModel.findOneByEmail(reqBody.email);

    if (!existUser)
      throw new ApiError(StatusCodes.NOT_FOUND, "Account not found!");

    if (!existUser.isActive)
      throw new ApiError(
        StatusCodes.NOT_ACCEPTABLE,
        "Your account is not active. Please verify active!"
      );

    if (!bcryptjs.compareSync(reqBody.password, existUser.password))
      throw new ApiError(
        StatusCodes.NOT_ACCEPTABLE,
        "Your email or passsword is incorrect!"
      );
    /**
     * Nếu mọi thứ ok thì bắt đầu tạo Tokens đăng nhập đề trả về cho phía FE
     */

    // Tạo thông tin để đính kèm trong JWT Token bao gồm _id và email của user
    const userInfo = {
      _id: existUser._id,
      email: existUser.email,
    };

    // Tạo ra 2 loại token, accessToken và refreshToken đề trả về cho phía FE
    const accessToken = await JwtProvider.generateToken(
      userInfo,
      env.ACCESS_TOKEN_SECRET_SIGNATURE,
      env.ACCESS_TOKEN_LIFE
    );

    const refreshToken = await JwtProvider.generateToken(
      userInfo,
      env.REFRESH_TOKEN_SECRET_SIGNATURE,
      env.REFRESH_TOKEN_LIFE
    );

    // Trả về thông tin của user kèm theo 2 cái token vừa tạo ra
    return {
      accessToken,
      refreshToken,
      ...pickUser(existUser),
    };
  } catch (error) {
    throw error;
  }
};

const refreshToken = async (clientRefreshToken) => {
  try {
    const refreshTokenDecoded = await JwtProvider.verifyToken(
      clientRefreshToken,
      env.REFRESH_TOKEN_SECRET_SIGNATURE
    );

    const userInfo = {
      _id: refreshTokenDecoded._id,
      email: refreshTokenDecoded.email,
    };

    const accessToken = await JwtProvider.generateToken(
      userInfo,
      env.ACCESS_TOKEN_SECRET_SIGNATURE,
      env.ACCESS_TOKEN_LIFE
    );

    return { accessToken };
  } catch (error) {
    throw error;
  }
};

export const userService = {
  createNew,
  verifyAccount,
  login,
  refreshToken,
};
