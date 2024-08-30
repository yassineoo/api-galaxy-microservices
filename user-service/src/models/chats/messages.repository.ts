import { message_entities as Message } from "@prisma/client";
import TryCatch from "../../utils/try-catch";
import { ID } from "../../validators/chats/_common";
import { prismaClientSingleton } from "../../utils/prisma";

export default class MessagesRepository {
  static getChatroomMessages = async (chatroomId: ID) => {
    return await TryCatch<Message>(async () => {
      const messages = await prismaClientSingleton.message_entities.findMany({
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
    });
  };

  static createChatroomMessage = async (
    content: string,
    senderId: ID,
    chatroomId: ID
  ) => {
    return await TryCatch<Message>(async () => {
      const newMessage = await prismaClientSingleton.message_entities.create({
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
    });
  };
}
