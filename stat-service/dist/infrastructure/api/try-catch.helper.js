"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
async function TryCatch(res, cb) {
    try {
        return await cb();
    }
    catch (e) {
        let payload;
        if (e instanceof zod_1.ZodError)
            payload = { error: e.errors };
        else if (e instanceof Error)
            return payload = { error: e.message };
        else if (e && typeof e === "object" && "message" in e)
            payload = { error: e.message };
        else
            payload = { error: "Internal Server Error" };
        return res.status(500).json(payload);
    }
}
exports.default = TryCatch;
