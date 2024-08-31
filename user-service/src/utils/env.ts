import { config } from "dotenv";
import { z, ZodError } from "zod"
config()

const validateEnvSchema = z.object({
    DATABASE_URL: z.string(),
    PORT: z.coerce.number(),
    GRPC_AUTH_SERVER_PORT: z.coerce.number(),
    GRPC_AUTH_SERVER_HOST: z.string()

})

export default function ValidateEnv() {
    try {
        const env = validateEnvSchema.parse(process.env)
        return env;
    } catch (error) {
        if (error instanceof ZodError || error instanceof Error) throw error
        throw new Error("Invalid environment variables")
    }
}

export const ENV = ValidateEnv()