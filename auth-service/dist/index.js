"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const cors_1 = __importDefault(require("cors"));
const axios_1 = __importDefault(require("axios"));
const http_1 = __importDefault(require("http"));
const authRouter_1 = __importDefault(require("./routes/authRouter"));
const userRouter_1 = __importDefault(require("./routes/userRouter"));
const profileRouter_1 = __importDefault(require("./routes/profileRouter"));
const swagger_1 = require("./utils/swagger");
const config_1 = __importDefault(require("./utils/config"));
const env_1 = __importDefault(require("./utils/env"));
const grpc_auth_server_1 = require("./grpc/grpc-auth.server");
require("dotenv").config();
const app = (0, express_1.default)();
(0, env_1.default)();
const server = http_1.default.createServer(app);
const logConfig = config_1.default["development"];
const log = logConfig.log();
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
app.use("/user", userRouter_1.default);
app.use("/profile", profileRouter_1.default);
app.use("/", authRouter_1.default);
app.get("/hello", (req, res) => res.send("hello"));
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.specs));
// Important - a service should not have a fixed port but should randomly choose one
server.listen(7000);
server.on("listening", () => {
    const addr = server.address();
    const PORT = typeof addr === "string" ? addr : addr === null || addr === void 0 ? void 0 : addr.port;
    const registerService = () => axios_1.default
        .put(
    //  `http://localhost:3001/register/${logConfig.serviceName}/${
    `http://service-registry:3001/register/${logConfig.serviceName}/${logConfig.version}/${
    //  server?.address()?.port ||
    Number(PORT)}`)
        .catch((err) => console.log({ err })); //log.fatal(err));
    const unregisterService = () => axios_1.default
        .delete(`http://service-registry:3001/register/${logConfig.serviceName}/${logConfig.version}/${
    //  server?.address()?.port ||
    PORT}`)
        .catch((err) => console.log({ err })); //log.fatal(err));
    registerService();
    const interval = setInterval(registerService, 15 * 1000);
    const cleanup = () => __awaiter(void 0, void 0, void 0, function* () {
        let clean = false;
        if (!clean) {
            clean = true;
            clearInterval(interval);
            yield unregisterService();
        }
    });
    process.on("uncaughtException", () => __awaiter(void 0, void 0, void 0, function* () {
        yield cleanup();
        process.exit(0);
    }));
    process.on("SIGINT", () => __awaiter(void 0, void 0, void 0, function* () {
        yield cleanup();
        process.exit(0);
    }));
    process.on("SIGTERM", () => __awaiter(void 0, void 0, void 0, function* () {
        yield cleanup();
        process.exit(0);
    }));
    log.info(`Hi there! I'm listening on port ${
    //  server?.address()?.port ||
    PORT} in ${app.get("env")} mode.`);
});
grpc_auth_server_1.GrpcAuthServer.init();
