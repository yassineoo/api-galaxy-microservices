import ChatroomsRepository from "../../../../models/chats/chatrooms.repository";
import userModel from "../../../../models/userModel";
import { ID } from "../../../../validators/chats/_common";

export default async function delete_chatroom_service(userId: ID, chatroomId: ID) {

    // validation
    const isUserExist = await userModel.isUserExist(userId)
    if (!isUserExist) throw new Error("User doesn't exist")

    const isChatroomExists = await ChatroomsRepository.isChatroomExists(chatroomId)
    if (!isChatroomExists) throw new Error("Chatroom doesn't exist")

    const chatroomMemeberIds = await ChatroomsRepository.getChatroomMemeberIds(chatroomId)
    if (!chatroomMemeberIds.includes(userId)) throw new Error("You are not a member of this chatroom")

    await ChatroomsRepository.deleteChatroom(chatroomId)
}