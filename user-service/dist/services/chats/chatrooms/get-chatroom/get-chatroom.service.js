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
exports.default = get_chatroom_service;
const chatrooms_repository_1 = __importDefault(require("../../../../models/chats/chatrooms.repository"));
function get_chatroom_service(chatroomId) {
    return __awaiter(this, void 0, void 0, function* () {
        const isChatroomExists = yield chatrooms_repository_1.default.isChatroomExists(chatroomId);
        if (!isChatroomExists)
            throw new Error("Chatroom doesn't exist");
        const chatroom = yield chatrooms_repository_1.default.getChatroom(chatroomId);
        console.log({ chatroom });
        return chatroom;
    });
}
