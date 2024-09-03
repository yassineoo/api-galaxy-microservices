import { Server as SocketServer, Socket } from "socket.io";
import { ID } from "../../validators/chats/_common";
import { connect_user_event_validator } from "../../validators/chats/chatrooms/connect-user/connect-user.request";
import { disconnect_user_event_validator } from "../../validators/chats/chatrooms/disconnect-user/disconnect-user.request";
import { create_chatroom_message_event_validator } from "../../validators/chats/messages/create-chatroom-message/create-chatroom-message.request";
import { Server } from "http";
import GrpcAuthClient from "../../grpc/grpc-auth.client";
import create_chatroom_messages_service from "../../services/chats/messages/create-chatroom-message/create-chatroom-message.service";

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
      console.log({ socket: socket.rooms })
      socket.on("connect_user", async (data) => {
        try {
          console.log("EVENT ==> CONNECT_USER");
          const { userId, chatroomId } = connect_user_event_validator.parse(data);
          console.log({ userId, chatroomId })
          if (this.is_user_already_connected(userId)) {
            socket.emit("connect_user_error", {
              error: "User already connected",
            });
          }
          this.connect_user(userId, socket.id);
          if (!socket.rooms.has(chatroomId.toString())) socket.rooms.add(chatroomId.toString())
          await socket.join(chatroomId.toString())
          console.log({ sockets: socket.rooms })
          io.emit("connected_users", "SUCCESS");
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
          const { content, senderId, chatroomId, receiverId, createdAt, id } =
            create_chatroom_message_event_validator.parse(data);

          const receiverSocketId = this.get_socket_id(receiverId);
          console.log({ receiverSocketId })
          if (!receiverSocketId) return;

          // const newMessage = await create_chatroom_messages_service(chatroomId, senderId, content);
          // console.log({ newMessage })
          console.log({ sockets: socket.rooms })
          socket.to(chatroomId.toString()).emit(
            "receive_message",
            this.formatNewMessage({ message: content, created_at: createdAt, id }, senderId, chatroomId)
          );

          // socket.to(socket.id).emit(
          // "receive_message",
          // this.formatNewMessage({ message: content, created_at: createdAt, id }, senderId, chatroomId)
          // )

        } catch (error) {
          this.handle_error(socket, "send_message", error);
        }
      });
    });
  }
  private formatNewMessage(message: {
    id: bigint;
    message: string;
    created_at: string;
  },
    senderId: ID,
    chatroomId: ID
  ) {
    return {
      id: Number(message.id),
      userId: Number(senderId),
      message: message.message,
      createdAt: message.created_at,
      chatroomId: Number(chatroomId),
    }
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
