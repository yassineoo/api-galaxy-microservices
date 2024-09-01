import { Server as SocketServer, Socket } from "socket.io";
import { ID } from "../../validators/chats/_common";
import { connect_user_event_validator } from "../../validators/chats/chatrooms/connect-user/connect-user.request";
import { disconnect_user_event_validator } from "../../validators/chats/chatrooms/disconnect-user/disconnect-user.request";
import { create_chatroom_message_event_validator } from "../../validators/chats/messages/create-chatroom-message/create-chatroom-message.request";
import { Server } from "http";
import GrpcAuthClient from "../../grpc/grpc-auth.client";

export default class ChatsGateway {
  private _instance: SocketServer;

  private _connected_users: Map<ID, string>;

  constructor() {
    this._instance = new SocketServer();
    this._connected_users = new Map<ID, string>();
  }

  get io() {
    if (this._instance) return this._instance;
    return new ChatsGateway()._instance;
  }

  get connected_users() {
    return this._connected_users;
  }

  attatchServer(server: Server) {
    this.io.attach(server, { cors: { origin: "*" } });
  }

  auth() {
    this.io.use(async (socket, next) => {
      const token = socket.handshake.auth.token;
      if (!token) next(new Error("Unauthorized"))
      GrpcAuthClient.client.Authenticate({
        authHeader: token
      }, (error, payload) => {
        if (error) {
          next(new Error("Unauthorized"))
        }
        if (payload) {
          if (!payload.valid) next(new Error("Unauthorized"))
          next()
        }
      })
    })
  }

  initListeners() {
    this.auth()

    const io = this.io;
    io.on("connection", (socket) => {
      socket.on("connect_user", (data) => {
        try {
          console.log("EVENT ==> CONNECT_USER");
          const { userId } = connect_user_event_validator.parse(data);
          if (this.is_user_already_connected(userId)) {
            socket.emit("connect_user_error", {
              error: "User already connected",
            });
          }
          this.connect_user(userId, socket.id);
          io.emit("connected_users", this.connected_users);
        } catch (error) {
          this.handle_error(socket, "connect_user", error);
        }
      });

      socket.on("disconnect_user", (data) => {
        try {
          console.log("EVENT ==> DISCONNECT_USER");
          const { userId } = disconnect_user_event_validator.parse(data);
          if (!this.is_user_already_connected(userId)) {
            socket.emit("disconnect_user_error", {
              error: "User isn't connected",
            });
          }
          this.disconnect_user(userId);
          io.emit("connected_users", userId);
        } catch (error) {
          this.handle_error(socket, "disconnect_user", error);
        }
      });

      socket.on("send_message", async (data) => {
        try {
          console.log("EVENT ==> SEND_MESSAGE");
          const { content, senderId, chatroomId, receiverId } =
            create_chatroom_message_event_validator.parse(data);

          const receiverSocketId = this.get_socket_id(receiverId);
          if (!receiverSocketId) return;

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
        } catch (error) {
          this.handle_error(socket, "send_message", error);
        }
      });
    });
  }

  private is_user_already_connected(userId: ID) {
    return this._connected_users.get(userId) ? true : false;
  }
  private connect_user(userId: ID, socketId: string) {
    return this._connected_users.set(userId, socketId);
  }
  private disconnect_user(userId: ID) {
    return this._connected_users.delete(userId);
  }

  private get_socket_id(userId: ID) {
    return this._connected_users.get(userId);
  }

  private handle_error(socket: Socket, listener_name: string, error: unknown) {
    console.log(error);
    socket.emit(`${listener_name}_error`, { error });
  }
}
