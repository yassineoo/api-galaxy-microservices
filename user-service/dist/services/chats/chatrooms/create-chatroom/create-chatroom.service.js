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
exports.default = create_chatroom_service;
const chatrooms_repository_1 = __importDefault(require("../../../../models/chats/chatrooms.repository"));
const userModel_1 = __importDefault(require("../../../../models/userModel"));
function create_chatroom_service(creatorId, receptorId) {
    return __awaiter(this, void 0, void 0, function* () {
        // validation
        const [creatorExist, receptorExist] = yield Promise.all([
            userModel_1.default.isUserExist(creatorId),
            userModel_1.default.isUserExist(receptorId),
        ]);
        if (!creatorExist || !receptorExist) {
            throw new Error("Users don't exist");
        }
        const newChatroom = yield chatrooms_repository_1.default.createChatroom(creatorId, receptorId);
        return newChatroom;
    });
}
