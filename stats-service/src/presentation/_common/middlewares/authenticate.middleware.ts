import { NextFunction, Response } from "express";
import AuthClient from "../../../infrastructure/grpc/grpc-auth.client"
import { AuthRequest } from "../../../infrastructure/api/auth-request";

export default async function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
    console.log("AUTH_MIDDLEWARE")

    const authHeader = req.headers.authorization
    console.log({ authHeader })
    if (!authHeader) throw new Error("Unauthorized")

    const token = authHeader.split(" ")[1]
    console.log({ token });
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