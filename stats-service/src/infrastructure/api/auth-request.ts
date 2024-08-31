import { Request as ExpressRequest } from "express";

export interface AuthRequest extends ExpressRequest {
    userId?: number
}