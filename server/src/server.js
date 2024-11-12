/* eslint-disable no-console */
import express from "express";
import { CLOSE_DB, CONNECT_DB } from "~/config/mongodb";
import exitHook from "async-exit-hook";
import "dotenv/config";
import { env } from "~/config/environment";
import { APIs_V1 } from "~/routes/v1";

const START_SERVER = () => {
  const app = express();

  const hostname = env.APP_HOST;
  const port = env.APP_PORT || 8888;

  // Enable req.body json data
  app.use(express.json());

  // Use APIs v1
  app.use("/v1", APIs_V1);
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
