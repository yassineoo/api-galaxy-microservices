import { config } from "dotenv";
import { z, ZodError } from "zod"
config()

const validateEnvSchema = z.object({
    GRPC_AUTH_SERVER_PORT: z.coerce.number(),
    GRPC_AUTH_SERVER_HOST: z.string()
})

export default function ValidateEnv() {
    try {
        const env = validateEnvSchema.parse(process.env)
        return env;
    } catch (error) {
        if (error instanceof ZodError) {
            console.log({ error })
            const prettyErrors = error.errors.map(err => `${err.code} in ${err.path} : ${err.message}`)

            const something = {
                message: "Invalid environment variables",
                errors: prettyErrors
            }

            throw something
        }
        else throw new Error("Invalid environment variables")
    }
}

export const ENV = ValidateEnv()