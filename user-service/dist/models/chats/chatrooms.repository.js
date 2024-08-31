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
class ChatroomsRepository {
}
_a = ChatroomsRepository;
ChatroomsRepository.createChatroom = (creatorId, receptorId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, try_catch_1.default)(() => __awaiter(void 0, void 0, void 0, function* () {
        // const chatroom = await prismaClientSingleton.chatroom_entities.create({
        // data: {
        // creator_id: creatorId,
        // receptor_id: receptorId
        // }
        // })
        const chatroom = yield prisma_1.prismaClientSingleton.chatroom_entities.create({
            data: {
                user_chatroom_entities: {
                    create: [{ user_id: creatorId }, { user_id: receptorId }],
                },
            },
        });
        return chatroom;
    }));
});
ChatroomsRepository.getUserChatrooms = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, try_catch_1.default)(() => __awaiter(void 0, void 0, void 0, function* () {
        const chatrooms = yield prisma_1.prismaClientSingleton.chatroom_entities.findMany({
            where: {
                user_chatroom_entities: {
                    some: {
                        user_id: userId,
                    },
                },
            },
            include: {
                user_chatroom_entities: {
                    include: {
                        user_entities: {
                            include: {
                                profile_entities: true,
                            },
                        },
                    },
                },
            },
        });
        const lastMessage = yield prisma_1.prismaClientSingleton.message_entities
            .findMany({
            where: {
                chatroom_id: {
                    in: chatrooms.map((chatroom) => chatroom.id),
                },
            },
            orderBy: {
                created_at: "desc",
            },
            take: 1,
            select: {
                message: true,
                id: true,
                created_at: true,
                chatroom_id: true,
                user_entities: {
                    select: {
                        id: true,
                    },
                },
            },
        })
            .then((r) => r === null || r === void 0 ? void 0 : r[0]);
        const prettyChatrooms = chatrooms.map((chatroom) => ({
            id: Number(chatroom.id),
            users: chatroom.user_chatroom_entities.map((user_chatroom) => ({
                id: Number(user_chatroom.user_entities.id),
                name: user_chatroom.user_entities.username,
                avatar: user_chatroom.user_entities.image,
            })),
            lastMessage: lastMessage
                ? {
                    id: Number(lastMessage.id),
                    message: lastMessage.message,
                    chatroom_id: Number(lastMessage.chatroom_id),
                    user_id: Number(lastMessage.user_entities.id),
                    createdAt: lastMessage.created_at,
                }
                : null,
        }));
        return prettyChatrooms;
    }));
});
ChatroomsRepository.getChatroom = (chatroomId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, try_catch_1.default)(() => __awaiter(void 0, void 0, void 0, function* () {
        const chatroom = yield prisma_1.prismaClientSingleton.chatroom_entities.findUnique({
            where: {
                id: chatroomId,
            },
            include: {
                user_chatroom_entities: {
                    include: {
                        user_entities: true,
                    },
                },
                message_entities: {
                    include: {
                        user_entities: true,
                    },
                },
            },
        });
        if (!chatroom || !chatroom.id)
            throw new Error("Chatroom doesn't exist");
        const prettyChatroom = {
            id: Number(chatroom.id),
            messages: chatroom.message_entities.map((message) => ({
                id: Number(message.id),
                message: message.message,
                chatroomId: Number(message.chatroom_id),
                userId: Number(message.user_id),
                user: {
                    name: message.user_entities.username,
                    avatar: message.user_entities.image,
                    id: Number(message.user_entities.id),
                },
            })),
            users: chatroom.user_chatroom_entities.map((user_chatroom) => ({
                id: Number(user_chatroom.user_entities.id),
                name: user_chatroom.user_entities.username,
                avatar: user_chatroom.user_entities.image,
            })),
        };
        return prettyChatroom;
    }));
});
ChatroomsRepository.deleteChatroom = (chatroomId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, try_catch_1.default)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma_1.prismaClientSingleton.chatroom_entities.deleteMany({
            where: {
                id: chatroomId,
            },
        });
    }));
});
ChatroomsRepository.isChatroomExists = (chatroomId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, try_catch_1.default)(() => __awaiter(void 0, void 0, void 0, function* () {
        const chatroom = yield prisma_1.prismaClientSingleton.chatroom_entities.findUnique({
            where: {
                id: chatroomId,
            },
            select: {
                id: true,
            },
        });
        if (chatroom && chatroom.id)
            return true;
        return false;
    }));
});
ChatroomsRepository.getChatroomMemeberIds = (chatroomId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, try_catch_1.default)(() => __awaiter(void 0, void 0, void 0, function* () {
        const chatroom = yield prisma_1.prismaClientSingleton.chatroom_entities.findUnique({
            where: {
                id: chatroomId,
            },
            select: {
                user_chatroom_entities: {
                    select: {
                        user_id: true,
                    },
                },
            },
        });
        if (chatroom && chatroom.user_chatroom_entities) {
            return chatroom.user_chatroom_entities.map((user) => user.user_id);
        }
        return [];
    }));
});
exports.default = ChatroomsRepository;
