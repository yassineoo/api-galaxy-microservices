import { config } from "dotenv";
import { z, ZodError } from "zod"
config()

const validateEnvSchema = z.object({
    DATABASE_URL: z.string(),
    TOKEN_SECRET: z.string(),
    EMAIL_TOKEN_SECRET: z.string(),
    EXPIRES_IN: z.string(),
    EMAIL_TOKEN_EXPIRY: z.string(),
    Auth_email: z.string(),
    App_password: z.string(),
    JWT_SECRET: z.string(),
    JWT_EXPIRATION: z.string(),
    PORT: z.coerce.number(),
    SMTP_HOST: z.string(),
    SMTP_PORT: z.coerce.number(),
    SMTP_SERVICE: z.string(),
    SMTP_MAIL: z.string(),
    SMTP_PASSWORD: z.string(),
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