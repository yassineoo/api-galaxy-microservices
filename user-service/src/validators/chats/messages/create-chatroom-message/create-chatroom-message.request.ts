import { z } from "zod"
import { content_validator, id_validator } from "../../_common"

const body_validator = z.object({
    content: content_validator,
    senderId: id_validator
})

const params_validator = z.object({
    chatroomId: id_validator,
})

export const create_chatroom_message_validator = {
    body: body_validator,
    params: params_validator
}

export const create_chatroom_message_event_validator = z.object({
    content: content_validator,
    senderId: id_validator,
    chatroomId: id_validator,
    receiverId: id_validator,
    createdAt: z.string(),
    id: id_validator
})