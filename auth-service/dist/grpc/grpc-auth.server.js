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
exports.GrpcAuthServer = void 0;
const path_1 = __importDefault(require("path"));
const grpc = __importStar(require("@grpc/grpc-js"));
const protoLoader = __importStar(require("@grpc/proto-loader"));
const env_1 = require("../utils/env");
const token_1 = require("../utils/token");
const PROTO_FILE = '../grpc/proto/auth.proto';
const packageDef = protoLoader.loadSync(path_1.default.resolve(__dirname, PROTO_FILE));
const grpcObj = grpc.loadPackageDefinition(packageDef);
const AuthService = grpcObj.auth.AuthService;
const authService = {
    Authenticate: (call, callback) => {
        try {
            console.log({ call, request: call.request, authHeader: call.request.authHeader, secret: env_1.ENV.JWT_SECRET });
            const decodeTokenResult = (0, token_1.decodeAuthToken)(call.request.authHeader, env_1.ENV.JWT_SECRET);
            console.log({ decodeTokenResult });
            return callback(null, { valid: true, userId: decodeTokenResult.userId });
        }
        catch (err) {
            console.log({ err });
            const error = new Error("Unauthorized");
            console.log({ error });
            return callback(error, { valid: false, userId: 0 });
        }
    }
};
class GrpcAuthServer {
    constructor() { }
    static init() {
        this._instance = this.initAuthServer();
    }
    static get client() {
        if (this._instance)
            return this._instance;
        throw new Error("Grpc Auth Server not initialized");
    }
    static initAuthServer() {
        const server = new grpc.Server();
        server.addService(AuthService.service, authService);
        server.bindAsync(`${env_1.ENV.GRPC_AUTH_SERVER_HOST}:${env_1.ENV.GRPC_AUTH_SERVER_PORT}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log(`Your server as started on port ${port}`);
            server.start();
        });
        return server;
    }
}
exports.GrpcAuthServer = GrpcAuthServer;
