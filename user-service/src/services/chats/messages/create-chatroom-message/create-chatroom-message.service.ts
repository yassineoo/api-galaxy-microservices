import ChatroomsRepository from "../../../../models/chats/chatrooms.repository";
import MessagesRepository from "../../../../models/chats/messages.repository";
import { Content, ID } from "../../../../validators/chats/_common";

export default async function create_chatroom_messages_service(
    chatroomId: ID,
    userId: ID,
    content: Content
) {

    // validation
    const isChatroomExist = await ChatroomsRepository.isChatroomExists(chatroomId)
    if (!isChatroomExist) throw new Error("Chatroom doesn't exist")

    const chatroomMemeberIds = await ChatroomsRepository.getChatroomMemeberIds(chatroomId)
    console.log("Chatroom", await ChatroomsRepository.getChatroom(chatroomId))
    if (!chatroomMemeberIds.includes(userId)) throw new Error("You are not a member of this chatroom")

    const chatroom = await MessagesRepository.createChatroomMessage(content, userId, chatroomId)

    return chatroom
}