import { Response } from "express"
import { ZodError } from "zod"

export default async function TryCatch(res: Response, cb: Function) {
    try {
        return await cb()
    }
    catch (e) {
        let payload: any
        if (e instanceof ZodError) payload = { error: e.errors }
        else if (e instanceof Error) return payload = { error: e.message }
        else if (e && typeof e === "object" && "message" in e) payload = { error: e.message }
        else payload = { error: "Internal Server Error" }
        return res.status(500).json(payload)
    }

}