import { NextFunction } from "express";
import { AuthRequest } from "../../../infrastructure/api/auth-request";
import { ID } from "../../../contracts/endpoint-stats/_common";

export default function get_user_id_from_request(req: AuthRequest, next: NextFunction): ID {
    const userId = req.userId
    if (!userId) {
        next(new Error("Unauthorized"))
        // This code after throw error with next will not be executed
        return BigInt(0);
    }
    return BigInt(userId)
}