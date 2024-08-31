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
const grpc = __importStar(require("@grpc/grpc-js"));
const protoLoader = __importStar(require("@grpc/proto-loader"));
const path_1 = __importDefault(require("path"));
const env_1 = require("../utils/env");
const PROTO_PATH = path_1.default.join(__dirname, '../grpc/proto/auth.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {});
const grpcObj = grpc.loadPackageDefinition(packageDefinition);
const AuthService = grpcObj.auth.AuthService;
class GrpcAuthClient {
    constructor() {
    }
    static init() {
        this._instance = new AuthService(`${env_1.ENV.GRPC_AUTH_SERVER_HOST}:${env_1.ENV.GRPC_AUTH_SERVER_PORT}`, grpc.credentials.createInsecure());
    }
    static get client() {
        if (this._instance)
            return this._instance;
        throw new Error("Client not initialized");
    }
}
exports.default = GrpcAuthClient;
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoianlfYXR0b3VAZXNpLmR6IiwiYXV0aFRva2VuIjoiNDdlYzg2Y2U0ZWQ0N2IyNjY4ZmFkNTA2ZWYxNWIyNzY0ZDI2NTk2NmZiMzA5OThlOWI4OGZjN2JjODIwY2VkNCIsImlhdCI6MTcyNDQ5ODM5OCwiZXhwIjoxNzI0NTAxOTk4fQ.AGBenl4CtxRLPEq7IAtVtfiVj2x6w_LjcfYiaqLvw6c
