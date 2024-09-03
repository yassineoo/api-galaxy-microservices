import { z } from "zod";
import { id_validator } from "../../_common";

const params_validator = z.object({
    userId: id_validator
})

export const get_user_chatrooms_validator = {
    params: params_validator
}
