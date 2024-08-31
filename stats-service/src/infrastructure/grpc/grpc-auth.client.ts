import * as grpc from "@grpc/grpc-js"
import * as protoLoader from "@grpc/proto-loader"
import path from "path"
import { ProtoGrpcType } from "./out/auth";
import { AuthServiceClient } from "./out/auth/AuthService";
import { ENV } from "../env";

const PROTO_PATH = path.join(__dirname, '../grpc/proto/auth.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {});

const grpcObj = grpc.loadPackageDefinition(packageDefinition) as unknown as ProtoGrpcType
const AuthService = grpcObj.auth.AuthService



export default class GrpcAuthClient {
    private static _instance: AuthServiceClient;

    private constructor() {
    }

    static init() {
        this._instance = new AuthService(
            `${ENV.GRPC_AUTH_SERVER_HOST}:${ENV.GRPC_AUTH_SERVER_PORT}`,
            grpc.credentials.createInsecure()
        )
    }

    static get client() {
        if (this._instance) return this._instance
        throw new Error("Client not initialized")
    }

}
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoianlfYXR0b3VAZXNpLmR6IiwiYXV0aFRva2VuIjoiNDdlYzg2Y2U0ZWQ0N2IyNjY4ZmFkNTA2ZWYxNWIyNzY0ZDI2NTk2NmZiMzA5OThlOWI4OGZjN2JjODIwY2VkNCIsImlhdCI6MTcyNDQ5ODM5OCwiZXhwIjoxNzI0NTAxOTk4fQ.AGBenl4CtxRLPEq7IAtVtfiVj2x6w_LjcfYiaqLvw6c