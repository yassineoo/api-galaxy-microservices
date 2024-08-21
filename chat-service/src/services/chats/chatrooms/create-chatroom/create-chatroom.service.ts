import ChatroomsRepository from "../../../../models/chats/chatrooms.repository";
import userModel from "../../../../models/userModel";
import { ID } from "../../../../validators/chats/_common";

export default async function create_chatroom_service(creatorId: ID, receptorId: ID) {

    // validation

    const [creatorExist, receptorExist] = await Promise.all([
        userModel.isUserExist(creatorId),
        userModel.isUserExist(receptorId),
    ]);

    if (!creatorExist || !receptorExist) {
        throw new Error("Users don't exist");
    }

    const newChatroom = await ChatroomsRepository.createChatroom(creatorId, receptorId)

    return newChatroom
}