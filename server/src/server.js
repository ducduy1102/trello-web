/* eslint-disable no-console */
import express from "express";
import { CLOSE_DB, CONNECT_DB } from "~/config/mongodb";
import exitHook from "async-exit-hook";
import "dotenv/config";
import { env } from "~/config/environment";
import { APIs_V1 } from "~/routes/v1";
import { errorHandlingMiddleware } from "./middlewares/errorHandlingMiddleware";
import { corsOptions } from "./config/cors";
import cors from "cors";
import cookieParser from "cookie-parser";

const START_SERVER = () => {
  const app = express();

  // https://stackoverflow.com/questions/22632593/how-to-disable-webpage-caching-in-expressjs-nodejs/53240717#53240717
  // Fix 'cache from disk' of ExpressJS
  app.use((req, res, next) => {
    res.set("Cache-Control", "no-store");
    next();
  });

  // Cấu hình cookie parser
  app.use(cookieParser());

  // app.use(cors()); // mọi nơi đều dc truy cập tài nguyên
  // Config xử lý cors cho từng domain dc phép truy cập
  app.use(cors(corsOptions));

  const hostname = env.APP_HOST;
  const port = env.APP_PORT || 8888;

  // Enable req.body json data
  app.use(express.json());

  // Use APIs v1
  app.use("/v1", APIs_V1);

  // Middleware xử lý lỗi tập trung
  app.use(errorHandlingMiddleware);

  app.listen(port, hostname, () => {
    console.log(
      `Hello Evil Shadow, I am running at http://${hostname}:${port}`
    );
  });

  exitHook(() => {
    console.log("Server is shutting down...");
    CLOSE_DB();
    console.log("Disconnected from MongoDB Cloud Atlas");
  });
};

// C1
// CONNECT_DB()
//   .then(() => {
//     console.log("Connected to MongoDB Cloud Atlas!");
//   })
//   .then(() => START_SERVER())
//   .catch((error) => {
//     console.error(error);
//     process.exit(0);
//   });

// C2 IIFE: Immediately Invoked Function Expression
// https://developer.mozilla.org/en-US/docs/Glossary/IIFE
(async () => {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await CONNECT_DB();
    console.log("Connected to MongoDB Cloud Atlas!");
    START_SERVER();
  } catch (error) {
    console.error(error);
    process.exit(0);
  }
})();
