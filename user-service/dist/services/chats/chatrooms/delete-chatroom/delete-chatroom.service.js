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
exports.default = delete_chatroom_service;
const chatrooms_repository_1 = __importDefault(require("../../../../models/chats/chatrooms.repository"));
const userModel_1 = __importDefault(require("../../../../models/userModel"));
function delete_chatroom_service(userId, chatroomId) {
    return __awaiter(this, void 0, void 0, function* () {
        // validation
        const isUserExist = yield userModel_1.default.isUserExist(userId);
        if (!isUserExist)
            throw new Error("User doesn't exist");
        const isChatroomExists = yield chatrooms_repository_1.default.isChatroomExists(chatroomId);
        if (!isChatroomExists)
            throw new Error("Chatroom doesn't exist");
        const chatroomMemeberIds = yield chatrooms_repository_1.default.getChatroomMemeberIds(chatroomId);
        if (!chatroomMemeberIds.includes(userId))
            throw new Error("You are not a member of this chatroom");
        yield chatrooms_repository_1.default.deleteChatroom(chatroomId);
    });
}
