import { z } from "zod";
import { durationValidator, idValidator } from "../endpoint-stats/_common";

export const get_api_stats_body_validator = z.object({
    api_ids: z.array(idValidator).nonempty("api_ids cannot be empty")
})

export const get_api_stats_query_validator = z.object({
    duration: durationValidator
})