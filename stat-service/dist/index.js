"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
const endpoints_stats_router_1 = __importDefault(require("./presentation/endpoints-stats/endpoints-stats.router"));
const api_stats_router_1 = __importDefault(require("./presentation/api-stats/api-stats.router"));
const swagger_1 = require("./utils/swagger");
require("dotenv").config();
const app = (0, express_1.default)();
const config_1 = __importDefault(require("./utils/config"));
const env_1 = __importStar(require("./infrastructure/env"));
(0, env_1.default)();
console.log({ ENV: env_1.ENV });
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
app.use("/stats/endpoints", endpoints_stats_router_1.default);
app.use("/stats/apis", api_stats_router_1.default);
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.specs));
const server = http_1.default.createServer(app);
const envConfig = config_1.default["development"];
const log = envConfig.log();
// Important - a service should not have a fixed port but should randomly choose one
server.listen(7001);
console.log("log port", process.env.PORT);
server.on("listening", () => {
    const addr = server.address();
    const PORT = typeof addr === "string" ? addr : addr?.port;
    console.log(`Listening onnnnn ${PORT}`);
    const registerService = () => axios_1.default
        .put(
    //  `http://localhost:3001/register/${envConfig.serviceName}/${
    `http://service-registry:3001/register/${envConfig.serviceName}/${envConfig.version}/${
    //  server?.address()?.port ||
    Number(PORT)}`)
        .catch((err) => log.fatal(err));
    const unregisterService = () => axios_1.default
        .delete(`http://service-registry:3001/register/${envConfig.serviceName}/${envConfig.version}/${
    //  server?.address()?.port ||
    PORT}`)
        .catch((err) => log.fatal(err));
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
    log.info(`Hi there! I'm listening on port ${
    //  server?.address()?.port ||
    PORT} in ${app.get("env")} mode.`);
});