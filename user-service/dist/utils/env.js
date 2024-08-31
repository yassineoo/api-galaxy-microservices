"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENV = void 0;
exports.default = ValidateEnv;
const dotenv_1 = require("dotenv");
const zod_1 = require("zod");
(0, dotenv_1.config)();
const validateEnvSchema = zod_1.z.object({
    DATABASE_URL: zod_1.z.string(),
    PORT: zod_1.z.coerce.number(),
    GRPC_AUTH_SERVER_PORT: zod_1.z.coerce.number(),
    GRPC_AUTH_SERVER_HOST: zod_1.z.string()
});
function ValidateEnv() {
    try {
        const env = validateEnvSchema.parse(process.env);
        return env;
    }
    catch (error) {
        if (error instanceof zod_1.ZodError || error instanceof Error)
            throw error;
        throw new Error("Invalid environment variables");
    }
}
exports.ENV = ValidateEnv();
