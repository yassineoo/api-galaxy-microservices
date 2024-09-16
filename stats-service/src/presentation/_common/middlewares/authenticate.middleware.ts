import { NextFunction, Response } from "express";
import AuthClient from "../../../infrastructure/grpc/grpc-auth.client";
import { AuthRequest } from "../../../infrastructure/api/auth-request";

export default async function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  console.log("AUTH_MIDDLEWARE");
  next();
  const authHeader = req.headers.authorization;
  console.log({ authHeader });
}
