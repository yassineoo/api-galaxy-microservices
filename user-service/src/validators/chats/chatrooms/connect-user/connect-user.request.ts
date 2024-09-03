import { z } from "zod";
import { id_validator } from "../../_common";

export const connect_user_event_validator = z.object({
    userId: id_validator,
    chatroomId:id_validator
})