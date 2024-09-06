import express from "express";
import swaggerUi from "swagger-ui-express";
import cors from "cors";
import axios from "axios";
import http from "http";

import EndpointsStatsRouter from "./presentation/endpoints-stats/endpoints-stats.router";
import ApisStatsRouter from "./presentation/api-stats/api-stats.router";

import { specs } from "./utils/swagger";
require("dotenv").config();
const app = express();

import config from "./utils/config";
import ValidateEnv, { ENV } from "./infrastructure/env";

ValidateEnv();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//app.use(cors());
app.use("/hello", (_, res: any) => res.send("Hello"));
app.use("/stats/endpoints", EndpointsStatsRouter);
app.use("/stats/apis", ApisStatsRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

const server = http.createServer(app);
const envConfig = config["development"];
const log = envConfig.log();

// Important - a service should not have a fixed port but should randomly choose one

server.listen(7001);
console.log("log port", process.env.PORT);

server.on("listening", () => {
  const addr = server.address();
  const PORT = typeof addr === "string" ? addr : addr?.port;
  console.log({ PORT });
  console.log(`Listening onnnnn ${PORT}`);
  const registerService = () =>
    axios
      .put(
        //  `http://localhost:3001/register/${envConfig.serviceName}/${
        `http://service-registry:3001/register/${envConfig.serviceName}/${
          envConfig.version
        }/${
          //  server?.address()?.port ||
          Number(PORT)
        }`
      )
      .catch((err: any) => log.fatal(err));

  const unregisterService = () =>
    axios
      .delete(
        `http://service-registry:3001/register/${envConfig.serviceName}/${
          envConfig.version
        }/${
          //  server?.address()?.port ||
          PORT
        }`
      )
      .catch((err: any) => log.fatal(err));

  registerService();
  const interval = setInterval(registerService, 15 * 1000);

  const cleanup = async () => {
    let clean = false;
    if (!clean) {
      clean = true;
      clearInterval(interval);
      await unregisterService();
    }
  };

  process.on("uncaughtException", async () => {
    await cleanup();
    process.exit(0);
  });

  process.on("SIGINT", async () => {
    await cleanup();
    process.exit(0);
  });

  process.on("SIGTERM", async () => {
    await cleanup();
    process.exit(0);
  });

  log.info(
    `Hi there! I'm listening on port ${
      //  server?.address()?.port ||
      PORT
    } in ${app.get("env")} mode.`
  );
});
