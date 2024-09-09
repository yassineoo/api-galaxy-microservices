import { NextFunction, Response } from "express";
import AuthClient from "../../grpc/grpc-auth.client";
import { AuthRequest } from "../../types/auth-request";

class UserError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UserError";
  }
}

export default async function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    console.log("authenticating");

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new UserError("Unauthorized: Missing authorization header");
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      throw new UserError("Unauthorized: Missing token");
    }

    const authClient = AuthClient.client;

    authClient.Authenticate(
      { authHeader: token },
      (error: any, payload: any) => {
        if (error || !payload || !payload.valid) {
          return next(new UserError("Unauthorized: Invalid or expired token"));
        }

        req.userId = payload.userId;
        next();
      }
    );
    console.log("authenticating done");
  } catch (err) {
    console.log("error", err);

    next(err);
  }
}
