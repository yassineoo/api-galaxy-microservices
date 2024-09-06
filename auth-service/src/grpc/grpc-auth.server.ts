import path from 'path'
import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import { ProtoGrpcType } from './out/auth'
import { ENV } from '../utils/env'
import { AuthServiceClient, AuthServiceHandlers } from './out/auth/AuthService'
import { AuthenticateRequest__Output } from './out/auth/AuthenticateRequest'
import { AuthenticateResponse__Output } from './out/auth/AuthenticateResponse'
import { decodeAuthToken } from '../utils/token'


const PROTO_FILE = '../grpc/proto/auth.proto'

const packageDef = protoLoader.loadSync(path.resolve(__dirname, PROTO_FILE))
const grpcObj = (grpc.loadPackageDefinition(packageDef) as unknown) as ProtoGrpcType
const AuthService = grpcObj.auth.AuthService

const authService: AuthServiceHandlers = {
    Authenticate: (
        call: grpc.ServerUnaryCall<AuthenticateRequest__Output, AuthenticateResponse__Output>,
        callback: grpc.sendUnaryData<AuthenticateResponse__Output>) => {
        try {
            console.log({ call, request: call.request, authHeader: call.request.authHeader, secret: ENV.JWT_SECRET })
            const decodeTokenResult = decodeAuthToken(call.request.authHeader, ENV.JWT_SECRET)
            console.log({ decodeTokenResult })
            return callback(null, { valid: true, userId: decodeTokenResult.userId })
        } catch (err) {
            console.log({ err })
            const error = new Error("Unauthorized")
            console.log({ error })
            return callback(error, { valid: false, userId: 0 })
        }
    }
}


export class GrpcAuthServer {
    private static _instance: grpc.Server

    private constructor() { }

    static init() {
        this._instance = this.initAuthServer()
    }

    static get client() {
        if (this._instance) return this._instance;
        throw new Error("Grpc Auth Server not initialized")
    }

    private static initAuthServer() {
        const server = new grpc.Server()

        server.addService(AuthService.service, authService)

        server.bindAsync(
            `${ENV.GRPC_AUTH_SERVER_HOST}:${ENV.GRPC_AUTH_SERVER_PORT}`,
            grpc.ServerCredentials.createInsecure(),
            (err, port) => {
                if (err) {
                    console.error(err)
                    return
                }
                console.log(`Your server as started on port ${port}`)
                server.start()
            })

        return server
    }

}