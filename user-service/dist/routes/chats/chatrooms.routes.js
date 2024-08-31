"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chatrooms_controller_1 = __importDefault(require("../../controllers/chats/chatrooms.controller"));
const messages_controller_1 = __importDefault(require("../../controllers/chats/messages.controller"));
const authenticate_middleware_1 = __importDefault(require("../../services/middlewares/authenticate.middleware"));
const ChatroomsRouter = (0, express_1.Router)();
ChatroomsRouter.use(authenticate_middleware_1.default);
// Messages Route
ChatroomsRouter.route("/:chatroomId/messages")
    .get(messages_controller_1.default.get_chatroom_messages)
    .post(messages_controller_1.default.create_chatroom_message);
ChatroomsRouter.route("/:chatroomId")
    .get(chatrooms_controller_1.default.get_chatroom)
    .delete(chatrooms_controller_1.default.delete_chatroom);
ChatroomsRouter.get("/users/:userId", chatrooms_controller_1.default.get_user_chatrooms);
ChatroomsRouter.post("/", chatrooms_controller_1.default.create_chatroom);
exports.default = ChatroomsRouter;
