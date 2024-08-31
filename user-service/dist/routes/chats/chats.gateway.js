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
const socket_io_1 = require("socket.io");
const connect_user_request_1 = require("../../validators/chats/chatrooms/connect-user/connect-user.request");
const disconnect_user_request_1 = require("../../validators/chats/chatrooms/disconnect-user/disconnect-user.request");
const create_chatroom_message_request_1 = require("../../validators/chats/messages/create-chatroom-message/create-chatroom-message.request");
const grpc_auth_client_1 = __importDefault(require("../../grpc/grpc-auth.client"));
class ChatsGateway {
    constructor() {
        this._instance = new socket_io_1.Server();
        this._connected_users = new Map();
    }
    get io() {
        if (this._instance)
            return this._instance;
        return new ChatsGateway()._instance;
    }
    get connected_users() {
        return this._connected_users;
    }
    attatchServer(server) {
        this.io.attach(server, { cors: { origin: "*" } });
    }
    auth() {
        this.io.use((socket, next) => __awaiter(this, void 0, void 0, function* () {
            const token = socket.handshake.auth.token;
            if (!token)
                next(new Error("Unauthorized"));
            grpc_auth_client_1.default.client.Authenticate({
                authHeader: token
            }, (error, payload) => {
                if (error) {
                    next(new Error("Unauthorized"));
                }
                if (payload) {
                    if (!payload.valid)
                        next(new Error("Unauthorized"));
                    next();
                }
            });
        }));
    }
    initListeners() {
        this.auth();
        const io = this.io;
        io.on("connection", (socket) => {
            socket.on("connect_user", (data) => {
                try {
                    console.log("EVENT ==> CONNECT_USER");
                    const { userId } = connect_user_request_1.connect_user_event_validator.parse(data);
                    if (this.is_user_already_connected(userId)) {
                        socket.emit("connect_user_error", {
                            error: "User already connected",
                        });
                    }
                    this.connect_user(userId, socket.id);
                    io.emit("connected_users", this.connected_users);
                }
                catch (error) {
                    this.handle_error(socket, "connect_user", error);
                }
            });
            socket.on("disconnect_user", (data) => {
                try {
                    console.log("EVENT ==> DISCONNECT_USER");
                    const { userId } = disconnect_user_request_1.disconnect_user_event_validator.parse(data);
                    if (!this.is_user_already_connected(userId)) {
                        socket.emit("disconnect_user_error", {
                            error: "User isn't connected",
                        });
                    }
                    this.disconnect_user(userId);
                    io.emit("connected_users", userId);
                }
                catch (error) {
                    this.handle_error(socket, "disconnect_user", error);
                }
            });
            socket.on("send_message", (data) => __awaiter(this, void 0, void 0, function* () {
                try {
                    console.log("EVENT ==> SEND_MESSAGE");
                    const { content, senderId, chatroomId, receiverId } = create_chatroom_message_request_1.create_chatroom_message_event_validator.parse(data);
                    const receiverSocketId = this.get_socket_id(receiverId);
                    if (!receiverSocketId)
                        return;
                    socket.to(receiverSocketId).emit("receive_message", {
                        id: Number(13),
                        userId: Number(senderId),
                        message: content,
                        createdAt: new Date().toISOString(),
                        chatroomId: Number(chatroomId),
                    });
                    socket.to(socket.id).emit("receive_message", {
                        id: Number(13),
                        userId: Number(senderId),
                        message: content,
                        createdAt: new Date().toISOString(),
                        chatroomId: Number(chatroomId),
                    });
                }
                catch (error) {
                    this.handle_error(socket, "send_message", error);
                }
            }));
        });
    }
    is_user_already_connected(userId) {
        return this._connected_users.get(userId) ? true : false;
    }
    connect_user(userId, socketId) {
        return this._connected_users.set(userId, socketId);
    }
    disconnect_user(userId) {
        return this._connected_users.delete(userId);
    }
    get_socket_id(userId) {
        return this._connected_users.get(userId);
    }
    handle_error(socket, listener_name, error) {
        console.log(error);
        socket.emit(`${listener_name}_error`, { error });
    }
}
exports.default = ChatsGateway;
