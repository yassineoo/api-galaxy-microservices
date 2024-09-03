import { Response } from "express";

export default async function ControllerTryCatch(res: Response, cb: Function) {
    try {
        return res.status(200).send(await cb())
    } catch (error) {
        console.log({ error })
        if (error instanceof Error) return res.status(500).send({ error: error.message })
        return res.status(500).send({ error: "Internal Server Error" })
    }
}