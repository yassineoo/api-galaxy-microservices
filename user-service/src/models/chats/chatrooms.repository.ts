import { chatroom_entities } from "@prisma/client";
import TryCatch from "../../utils/try-catch";
import { ID } from "../../validators/chats/_common";
import { prismaClientSingleton } from "../../utils/prisma";

interface Chatroom {
  id: number;
  users: {
    id: number;
    name: string;
    avatar: string | null;
  }[];
  lastMessage: {
    id: number;
    message: string;
    chatroom_id: number;
    createdAt: Date;
    user_id: number;
  } | null;
}

export default class ChatroomsRepository {
  static createChatroom = async (creatorId: ID, receptorId: ID) => {
    return await TryCatch<Chatroom>(async () => {
      // const chatroom = await prismaClientSingleton.chatroom_entities.create({
      // data: {
      // creator_id: creatorId,
      // receptor_id: receptorId
      // }
      // })

      const chatroom = await prismaClientSingleton.chatroom_entities.create({
        data: {
          user_chatroom_entities: {
            create: [{ user_id: creatorId }, { user_id: receptorId }],
          },
        },
      });

      return chatroom;
    });
  };

  static getUserChatrooms = async (userId: ID) => {
    return await TryCatch<Chatroom[]>(async () => {
      const chatrooms = await prismaClientSingleton.chatroom_entities.findMany({
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

      const lastMessage = await prismaClientSingleton.message_entities
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
        .then((r) => r?.[0]);

      const prettyChatrooms: Chatroom[] = chatrooms.map((chatroom) => ({
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
    });
  };

  static getChatroom = async (chatroomId: ID) => {
    return await TryCatch<Chatroom>(async () => {
      const chatroom = await prismaClientSingleton.chatroom_entities.findUnique(
        {
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
        }
      );

      if (!chatroom || !chatroom.id) throw new Error("Chatroom doesn't exist");

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
    });
  };

  static deleteChatroom = async (chatroomId: ID) => {
    return await TryCatch<void>(async () => {
      await prismaClientSingleton.chatroom_entities.deleteMany({
        where: {
          id: chatroomId,
        },
      });
    });
  };

  static isChatroomExists = async (chatroomId: ID) => {
    return await TryCatch<boolean>(async () => {
      const chatroom = await prismaClientSingleton.chatroom_entities.findUnique(
        {
          where: {
            id: chatroomId,
          },
          select: {
            id: true,
          },
        }
      );
      if (chatroom && chatroom.id) return true;
      return false;
    });
  };

  static getChatroomMemeberIds = async (chatroomId: ID) => {
    return await TryCatch<ID[]>(async () => {
      const chatroom = await prismaClientSingleton.chatroom_entities.findUnique(
        {
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
        }
      );
      if (chatroom && chatroom.user_chatroom_entities) {
        return chatroom.user_chatroom_entities.map((user) => user.user_id);
      }
      return [];
    });
  };
}
