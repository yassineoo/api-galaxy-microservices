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
exports.default = create_chatroom_messages_service;
const chatrooms_repository_1 = __importDefault(require("../../../../models/chats/chatrooms.repository"));
const messages_repository_1 = __importDefault(require("../../../../models/chats/messages.repository"));
function create_chatroom_messages_service(chatroomId, userId, content) {
    return __awaiter(this, void 0, void 0, function* () {
        // validation
        const isChatroomExist = yield chatrooms_repository_1.default.isChatroomExists(chatroomId);
        if (!isChatroomExist)
            throw new Error("Chatroom doesn't exist");
        const chatroomMemeberIds = yield chatrooms_repository_1.default.getChatroomMemeberIds(chatroomId);
        console.log("Chatroom", yield chatrooms_repository_1.default.getChatroom(chatroomId));
        if (!chatroomMemeberIds.includes(userId))
            throw new Error("You are not a member of this chatroom");
        const chatroom = yield messages_repository_1.default.createChatroomMessage(content, userId, chatroomId);
        return chatroom;
    });
}
