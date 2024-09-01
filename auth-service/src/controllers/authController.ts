import { NextFunction, Response } from "express";
import { statusCodes } from "../utils/http";
import authService from "../services/authService";
import { Role } from "../models/enum";
import { Request } from "../types";
import { sendMessage, connectProducer } from "../config/kafka";
import { log } from "console";
import { loginValidator, signupValidator } from "../validators/UAuthValidator";
import formatZodErrors from "../utils/zod.validation";

require("dotenv").config();

// connect producer
//connectProducer()

export const signup = (role: string) => {
  return async (req: Request, res: Response) => {
    try {
      const validation = signupValidator.safeParse(req.body);
      if (!validation.success) {
        console.log({ validation_error: validation.error });
        return res
          .status(statusCodes.badRequest)
          .json({ errors: formatZodErrors(validation.error) });
      }

      const tokenData = await authService.register(
        validation.data,
        role as Role
      );
      console.log({ tokenData });

      return res.status(statusCodes.ok).json({
        id: Number(tokenData.id),
        message: tokenData.message,
      });
    } catch (error: any) {
      console.log({ error });
      const { message } = error;
      // HADI MCHFTHACH MAIS M3LICH 500 IS ENOUGH
      return res.status(statusCodes.badRequest).json({ message });
    }
  };
};

export const login = async (req: Request, res: Response) => {
  try {
    const validation = loginValidator.safeParse(req.body);
    if (!validation.success) {
      return res
        .status(statusCodes.badRequest)
        .json({ errors: formatZodErrors(validation.error) });
    }

    const token = await authService.login(req.body);
    console.log("----------------------------------");
    console.log("----------------------------------");
    console.log("----------------------------------");
    console.log("----------------------------------");
    console.log("----------------------------------");
    console.log("----------------------------------");
    console.log("----------------------------------");
    console.log("----------------------------------");
    console.log("----------------------------------");
    console.log("----------------------------------");
    console.log("----------------------------------");
    console.log("----------------------------------");
    console.log("----------------------------------");
    console.log("----------------------------------");
    console.log("----------------------------------");
    console.log("----------------------------------");
    console.log("----------------------------------");
    console.log("----------------------------------");
    console.log("----------------------------------");
    console.log("----------------------------------");
    console.log("----------------------------------");
    console.log("----------------------------------");
    console.log("----------------------------------");
    console.log(token);
    console.log("----------------------------------");
    console.log("----------------------------------");
    console.log("----------------------------------");
    console.log("----------------------------------");
    console.log("----------------------------------");
    console.log("----------------------------------");
    console.log("----------------------------------");
    console.log("----------------------------------");
    console.log("----------------------------------");
    console.log("----------------------------------");
    console.log("----------------------------------");
    console.log("----------------------------------");
    console.log("----------------------------------");
    console.log("----------------------------------");
    console.log("----------------------------------");
    console.log("----------------------------------");
    console.log("----------------------------------");
    console.log("----------------------------------");
    console.log("----------------------------------");

    return res
      .status(statusCodes.ok)
      .send({ ...token, userId: Number(token.userId), token: token.token });
  } catch (error: any) {
    return res.status(statusCodes.badRequest).send({ error: error?.message });
  }
};

export const Oauthlogin = async (req: Request, res: Response) => {
  try {
    console.log("called from backend");
    const token = await authService.OathUser(req.body);
    //console.log("token", token);
    console.log({ token })
    return res.status(statusCodes.ok).json({ ...token });
  } catch (error: any) {
    res.status(statusCodes.badRequest).send({ message: error.message });
  }
};

//get user session

export const getUserSession = async (req: Request, res: Response) => {
  try {
    const token = await authService.getSession(req.body);
    res.status(statusCodes.ok).send({ ...token });
  } catch (error: any) {
    res.status(statusCodes.badRequest).send({ error: error.message });
  }
};

//requires being logged in
export const resendVerificationEmail = async (req: Request, res: Response) => {
  try {
    if (req.userId == null) {
      throw new Error("User not found");
    }
    authService.resendVerificationEmail(req.userId);
    res.status(statusCodes.ok).send("Email sent");
  } catch (error: any) {
    res.status(statusCodes.badRequest).send({ error: error.message });
  }
};

//requires a token to be sent in the link and being logged in
export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const data = req.params.token ?? req.body;
    const isEmailProvided = !Boolean(req.params.token);
    const result = (await authService.verifyEmail(
      data,
      isEmailProvided
    )) as any;
    if (!result?.message) {
      res.status(statusCodes.ok).send(true);
    } else {
      res.send(false);
    }
  } catch (error: any) {
    res.status(statusCodes.badRequest).send({ error: error.message });
  }
};

//reset password
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const result = (await authService.resetUserPassword(
      req.body,
      userId!
    )) as any;
    console.log(result);
    if (!result.message) {
      res.json({
        message: result?.message,
      });
    } else {
      res.status(statusCodes.ok).send(true);
    }
  } catch (error: any) {
    res.status(statusCodes.badRequest).json({
      message: error.message,
    });
  }
};

export const activateTwoFactors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      throw Error("invalid userId");
    }
    await authService.activateTwoFactors(userId);
    return res.status(200).send(true);
  } catch (error) {
    next(error);
  }
};

export const verifyOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { otp, userId } = req.body;
    await authService.verifyOTP(userId, otp);
    res.status(200).send(true);
  } catch (error) {
    next(error);
  }
};
