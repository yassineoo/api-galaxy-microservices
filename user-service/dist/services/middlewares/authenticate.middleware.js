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
exports.default = authenticate;
const grpc_auth_client_1 = __importDefault(require("../../grpc/grpc-auth.client"));
function authenticate(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("AUTH_MIDDLEWARE");
        const authHeader = req.headers.authorization;
        if (!authHeader)
            throw new Error("Unauthorized");
        const token = authHeader.split(" ")[1];
        if (!token)
            throw new Error("Unauthorized");
        const authClient = grpc_auth_client_1.default.client;
        authClient.Authenticate({
            authHeader: token
        }, (error, payload) => {
            console.log({ error, payload });
            if (error) {
                console.log({ error });
                next(new Error("Unauthorized"));
            }
            if (payload) {
                // error will be throw in first condifition, the code will not access this line if error exists , so payload.valid always will be true , and payload.userId will always has value
                if (!payload.valid)
                    next(new Error("Unauthorized"));
                req.userId = payload.userId;
                next();
            }
        });
    });
}
