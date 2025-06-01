import express from "express";
import { StatusCodes } from "http-status-codes";
import { boardRoute } from "~/routes/v1/boardRoute";
import { columnRoute } from "~/routes/v1/columnRoute";
import { cardRoute } from "~/routes/v1/cardRoute";
import { userRoute } from "~/routes/v1/userRoute";
import { invitationRoute } from "~/routes/v1/invitationRoute";

const Router = express.Router();

// Check aps /v1/status
Router.get("/status", (req, res) => {
  res.status(StatusCodes.OK).json({ message: "APIs V1 are ready!" });
});

// Boards APIs
Router.use("/boards", boardRoute);

// Columns APIs
Router.use("/columns", columnRoute);

// Cards APIs
Router.use("/cards", cardRoute);

// Users API
Router.use("/users", userRoute);

// Invitations API
Router.use("/invitations", invitationRoute);

export const APIs_V1 = Router;
