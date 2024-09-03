import ChatroomsRepository from "../../../../models/chats/chatrooms.repository";
import { ID } from "../../../../validators/chats/_common";

export default async function get_chatroom_service(chatroomId: ID) {

    const isChatroomExists = await ChatroomsRepository.isChatroomExists(chatroomId)

    if (!isChatroomExists) throw new Error("Chatroom doesn't exist")

    const chatroom = await ChatroomsRepository.getChatroom(chatroomId)

    return chatroom
}