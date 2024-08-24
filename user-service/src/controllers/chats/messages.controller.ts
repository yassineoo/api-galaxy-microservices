import { Request, Response } from "express";
import ControllerTryCatch from "../../utils/try-catch-controller";
import { get_chatroom_messages_validator } from "../../validators/chats/messages/get-chatroom-messages/get-chatroom-messages.request";
import get_chatroom_messages_service from "../../services/chats/messages/get-chatroom-messages/get-chatroom-messages.service";
import create_chatroom_messages_service from "../../services/chats/messages/create-chatroom-message/create-chatroom-message.service";
import { create_chatroom_message_validator } from "../../validators/chats/messages/create-chatroom-message/create-chatroom-message.request";

async function get_chatroom_messages(req: Request, res: Response) {
    return await ControllerTryCatch(res, async () => {
        console.log({ params: req.params })
        const { chatroomId } = get_chatroom_messages_validator.params.parse(req.params);

        return await get_chatroom_messages_service(chatroomId)
    })
}

async function create_chatroom_message(req: Request, res: Response) {
    return await ControllerTryCatch(res, async () => {
        const { content, senderId } = create_chatroom_message_validator.body.parse(req.body)
        const { chatroomId } = create_chatroom_message_validator.params.parse(req.params)


        return await create_chatroom_messages_service(chatroomId, senderId, content)
    })
}

const MessagesController = {
    get_chatroom_messages,
    create_chatroom_message
}

export default MessagesController