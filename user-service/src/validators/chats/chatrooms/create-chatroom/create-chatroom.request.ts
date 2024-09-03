import { z } from "zod";
import { id_validator } from "../../_common";

const body_validator = z.object({
    creatorId: id_validator,
    receptorId: id_validator
})

export const create_chatroom_validator = {
    body: body_validator
}