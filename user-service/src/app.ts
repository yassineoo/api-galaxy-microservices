import express from "express";
import cors from "cors";
import { handleErrors } from "./utils/errorHandler";
import http from "http";
import {kafka, sendMessage} from "./utils/kafka"
require("dotenv").config();
const app = express();
import config from "./utils/config";
import { userApiRouter } from "./routes/apiRoute";
import { adminRouter } from "./routes/admin/adminRoute";
import axios from "axios";
import ChatsGateway from "./routes/chats/chats.gateway";

import { Server } from "socket.io";
import ChatroomsRouter from "./routes/chats/chatrooms.routes";

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(cors({ origin: "*" }));
app.use(cors({ origin: true, credentials: true }));

console.log("hello from app.ts")

// Add this line to parse JSON bodies
app.use(express.json());
app.use((req, res, next) => {
  console.log(`API Gateway received: ${req.method} ${req.url}`);
  next();
});
app.use("/userApi", userApiRouter);
app.use("/chatrooms", ChatroomsRouter);
app.use("/admin",adminRouter)
app.use(handleErrors);

const server = http.createServer(app);
const envConfig = config["development"];
const log = envConfig.log();

const port = 7002;

const chatsGateway = new ChatsGateway();

chatsGateway.attatchServer(server);

chatsGateway.initListeners();

// Important - a service should not have a fixed port but should randomly choose one

server.listen(port);
// Important - a service should not have a fixed port but should randomly choose one

server.on("listening", () => {
  const addr = server.address();
  console.log(envConfig.version)
  const PORT = 7002;
  const registerService = () =>
    axios
      .put(
        `http://service-registry:3001/register/${envConfig.serviceName}/${
          //        `http://localhost:3001/register/${envConfig.serviceName}/${
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
          //        `http://localhost:3001/register/${envConfig.serviceName}/${
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
