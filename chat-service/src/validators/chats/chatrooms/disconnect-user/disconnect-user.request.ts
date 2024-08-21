import { z } from "zod";
import { id_validator } from "../../_common";

export const disconnect_user_event_validator = z.object({
    userId: id_validator,
})