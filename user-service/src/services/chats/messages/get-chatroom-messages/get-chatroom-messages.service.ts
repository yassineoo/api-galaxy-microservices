import ChatroomsRepository from "../../../../models/chats/chatrooms.repository";
import MessagesRepository from "../../../../models/chats/messages.repository";
import { ID } from "../../../../validators/chats/_common";

export default async function get_chatroom_messages_service(chatroomId: ID) {
    // validation

    const isChatroomExist = await ChatroomsRepository.isChatroomExists(chatroomId)
    if (!isChatroomExist) throw new Error("Chatroom doesn't exist")

    const messages = await MessagesRepository.getChatroomMessages(chatroomId)

    return messages
}