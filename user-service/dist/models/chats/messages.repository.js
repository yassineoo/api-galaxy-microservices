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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const try_catch_1 = __importDefault(require("../../utils/try-catch"));
const prisma_1 = require("../../utils/prisma");
class MessagesRepository {
}
_a = MessagesRepository;
MessagesRepository.getChatroomMessages = (chatroomId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, try_catch_1.default)(() => __awaiter(void 0, void 0, void 0, function* () {
        const messages = yield prisma_1.prismaClientSingleton.message_entities.findMany({
            where: {
                chatroom_id: chatroomId,
            },
            include: {
                user_entities: {
                    select: {
                        id: true,
                        username: true,
                        image: true,
                    },
                },
            },
        });
        const prettyMessages = messages.map((message) => ({
            user: {
                id: Number(message.user_entities.id),
                username: message.user_entities.username,
                image: message.user_entities.image,
            },
            id: Number(message.id),
            chatroomId: Number(message.chatroom_id),
            userId: Number(message.user_id),
            message: message.message,
            createdAt: message.created_at,
        }));
        return prettyMessages;
    }));
});
MessagesRepository.createChatroomMessage = (content, senderId, chatroomId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, try_catch_1.default)(() => __awaiter(void 0, void 0, void 0, function* () {
        const newMessage = yield prisma_1.prismaClientSingleton.message_entities.create({
            data: {
                message: content,
                user_id: senderId,
                chatroom_id: chatroomId,
            },
        });
        const prettyMessage = {
            id: Number(newMessage.id),
            chatroomId: Number(newMessage.chatroom_id),
            userId: Number(newMessage.user_id),
            message: newMessage.message,
            created_at: newMessage.created_at,
        };
        return prettyMessage;
    }));
});
exports.default = MessagesRepository;
