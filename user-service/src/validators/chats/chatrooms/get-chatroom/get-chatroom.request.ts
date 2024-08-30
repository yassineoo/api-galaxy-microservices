import { z } from "zod"
import { id_validator } from "../../_common"

const params_validator = z.object({
    chatroomId: id_validator
})

export const get_chatroom_validator = {
    params: params_validator
}

