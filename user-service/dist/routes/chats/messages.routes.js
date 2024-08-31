"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const messages_controller_1 = __importDefault(require("../../../../chat-service/src/controllers/chats/messages.controller"));
const MessagesRouter = (0, express_1.Router)();
MessagesRouter.get("/", messages_controller_1.default.get_chatroom_messages);
MessagesRouter.post("/", messages_controller_1.default.create_chatroom_message);
exports.default = MessagesRouter;
