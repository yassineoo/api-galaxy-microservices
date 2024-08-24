import { Request, Response } from "express";
import ControllerTryCatch from "../../utils/try-catch-controller";
import { get_user_chatrooms_validator } from "../../validators/chats/chatrooms/get-user-chatrooms/get-user-chatrooms.request";
import get_user_chatrooms_service from "../../services/chats/chatrooms/get-user-chatrooms/get-user-chatrooms.service";
import { get_chatroom_validator } from "../../validators/chats/chatrooms/get-chatroom/get-chatroom.request";
import get_chatroom_service from "../../services/chats/chatrooms/get-chatroom/get-chatroom.service";
import create_chatroom_service from "../../services/chats/chatrooms/create-chatroom/create-chatroom.service";
import { create_chatroom_validator } from "../../validators/chats/chatrooms/create-chatroom/create-chatroom.request";
import { delete_chatroom_validator } from "../../validators/chats/chatrooms/delete-chatroom/delete-chatroom.request";
import delete_chatroom_service from "../../services/chats/chatrooms/delete-chatroom/delete-chatroom.service";

async function get_user_chatrooms(req: Request, res: Response) {
    return await ControllerTryCatch(res, async () => {
        const { userId } = get_user_chatrooms_validator.params.parse(req.params)

        const user_chatrooms = await get_user_chatrooms_service(userId)
        return user_chatrooms
    })
}

async function get_chatroom(req: Request, res: Response) {
    return await ControllerTryCatch(res, async () => {
        const { chatroomId } = get_chatroom_validator.params.parse(req.params)

        return await get_chatroom_service(chatroomId)
    })
}

async function create_chatroom(req: Request, res: Response) {
    return await ControllerTryCatch(res, async () => {
        const { creatorId, receptorId } = create_chatroom_validator.body.parse(req.body)

        return await create_chatroom_service(creatorId, receptorId)
    })
}

async function delete_chatroom(req: Request, res: Response) {
    return await ControllerTryCatch(res, async () => {
        const { chatroomId, userId } = delete_chatroom_validator.body.parse(req.params)

        return await delete_chatroom_service(userId, chatroomId);
    })
}

const ChatroomsController = {
    get_user_chatrooms,
    get_chatroom,
    create_chatroom,
    delete_chatroom
}

export default ChatroomsController