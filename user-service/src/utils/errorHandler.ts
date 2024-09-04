import { Request, Response, NextFunction } from "express";

export class UserError extends Error {
  public isOperational;
  constructor(message: string) {
    super(message);
    this.name = "UserError";
    this.isOperational = true;
  }
}

export class SystemError extends Error {
  public isOperational;
  constructor(message: string) {
    super(message);
    this.name = "SystemError";
    this.isOperational = false;
  }
}

export const handleErrors = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof UserError) {
    console.log("user service error");
    console.log(err);

    return res.status(401).json({ error: true, message: err.message });
  } else if (err instanceof SystemError) {
    return res.status(500).json({ error: true, message: err.message });
  } else if (err.name === "CastError") {
    return res.status(400).json({
      error: true,
      message: `Resource not found: Invalid ${err.path}`,
    });
  } else if (err.code === 11000) {
    return res.status(400).json({
      error: true,
      message: `Duplicate ${Object.keys(err.keyValue).join(", ")} entered`,
    });
  } else if (err.name === "JsonWebTokenError") {
    return res.status(400).json({
      error: true,
      message: "Invalid JSON Web Token",
    });
  } else if (err.name === "TokenExpiredError") {
    return res.status(400).json({
      error: true,
      message: "JWT token has expired, please log in again",
    });
  } else if (err instanceof Error) {
    return res.status(500).json({
      error: true,
      message: err.message,
    });
  } else {
    return res.status(500).json({
      error: true,
      message: "Unexpected server error",
    });
  }
};
