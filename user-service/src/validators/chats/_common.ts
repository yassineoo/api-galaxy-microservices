import { z } from "zod";

export const id_validator = z.coerce.bigint()

export type ID = z.infer<typeof id_validator>

export const content_validator = z.string().min(1).max(500)

export type Content = z.infer<typeof content_validator>