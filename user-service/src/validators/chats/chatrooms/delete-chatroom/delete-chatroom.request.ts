import { z } from "zod"
import { id_validator } from "../../_common"

const body_validator = z.object({
    userId: id_validator,
    chatroomId: id_validator
})

export const delete_chatroom_validator = {
    body: body_validator
}
