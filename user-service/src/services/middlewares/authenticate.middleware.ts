import { NextFunction, Response } from "express";
import AuthClient from "../../grpc/grpc-auth.client";
import { AuthRequest } from "../../types/auth-request";

export default async function authenticate(req: AuthRequest, res: Response, next: NextFunction) {

    const authHeader = req.headers.authorization

    if (!authHeader) throw new Error("Unauthorized")

    const token = authHeader.split(" ")[1]

    if (!token) throw new Error("Unauthorized")

    const authClient = AuthClient.client

    authClient.Authenticate({
        authHeader: token
    }, (error, payload) => {
        console.log({ error, payload })
        if (error) {
            console.log({ error })
            next(new Error("Unauthorized"))
        }
        if (payload) {
            // error will be throw in first condifition, the code will not access this line if error exists , so payload.valid always will be true , and payload.userId will always has value
            if (!payload.valid) next(new Error("Unauthorized"))

            req.userId = payload.userId
            next()
        }
    })

} 