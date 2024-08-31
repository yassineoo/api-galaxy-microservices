"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const errorHandler_1 = require("./utils/errorHandler");
const http_1 = __importDefault(require("http"));
require("dotenv").config();
const app = (0, express_1.default)();
const config_1 = __importDefault(require("./utils/config"));
const apiRoute_1 = require("./routes/apiRoute");
const chats_gateway_1 = __importDefault(require("./routes/chats/chats.gateway"));
const chatrooms_routes_1 = __importDefault(require("./routes/chats/chatrooms.routes"));
const grpc_auth_client_1 = __importDefault(require("./grpc/grpc-auth.client"));
const env_1 = __importDefault(require("./utils/env"));
(0, env_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({
    extended: true,
}));
app.use((0, cors_1.default)({ origin: "*" }));
app.use((0, cors_1.default)({ origin: true, credentials: true }));
// Add this line to parse JSON bodies
app.use(express_1.default.json());
app.use((req, res, next) => {
    console.log(`API Gateway received: ${req.method} ${req.url}`);
    next();
});
app.use("/userApi", apiRoute_1.userApiRouter);
app.use("/chatrooms", chatrooms_routes_1.default);
app.use(errorHandler_1.handleErrors);
const server = http_1.default.createServer(app);
const envConfig = config_1.default["development"];
const log = envConfig.log();
const port = 7002;
const chatsGateway = new chats_gateway_1.default();
chatsGateway.attatchServer(server);
chatsGateway.initListeners();
// Important - a service should not have a fixed port but should randomly choose one
server.listen(7002);
// Important - a service should not have a fixed port but should randomly choose one
/*
server.on("listening", () => {
  const addr = server.address();
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
      .catch((err: any) => console.log({ err }))//log.fatal(err));
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
      .catch((err: any) => console.log({ err }))//log.fatal(err));
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

*/
grpc_auth_client_1.default.init();
