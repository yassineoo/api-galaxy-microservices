import ChatroomsRepository from "../../../../models/chats/chatrooms.repository";
import userModel from "../../../../models/userModel";
import { ID } from "../../../../validators/chats/_common";

export default async function get_user_chatrooms_service(userId: ID) {

    // validation 
    const isUserExist = await userModel.isUserExist(userId)
    if (!isUserExist) throw new Error("User doesn't exist")

    // await ChatroomsRepository.createChatroom(BigInt(1), BigInt(3))

    const chatrooms = await ChatroomsRepository.getUserChatrooms(userId)
    console.log({ chatrooms })
    return chatrooms
}