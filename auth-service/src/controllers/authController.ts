import { Response } from "express";
import { statusCodes } from "../utils/http";
import authService from "../services/authService";
import { Role } from "../models/enum";
import { Request } from "../types";
import { log } from "console";

require("dotenv").config();

export const signup = (role: string) => {
  return async (req: Request, res: Response) => {
    try {
      const tokenData = await authService.register(req.body, role as Role);

      if (tokenData.id) {
        return res.status(statusCodes.ok).json(tokenData);
      } else {
        return res
          .status(statusCodes.badRequest)
          .json({ message: tokenData?.message });
      }
    } catch (error: any) {
      const { message, statusCode = statusCodes.badRequest } = error;
      return res.status(statusCode).json({ message });
    }
  };
};

export const login = async (req: Request, res: Response) => {
  /*const { error } = UAuthValidator.loginSchema.validate(req.body);
    if (error) {
        console.log(error)
        res.status(statusCodes.badRequest).send(error.details[0].message);
        return;
    }
    console.log(req.body)
*/

  try {
    const token = await authService.login(req.body);
    console.log("tokennn", token);

    if (!token.message) {
      return res.status(statusCodes.ok).send({ ...token });
    } else {
      return res.json({ message: token?.message });
    }
  } catch (error: any) {
    res.status(statusCodes.badRequest).send({ error: error?.message });
  }
};

export const Oauthlogin = async (req: Request, res: Response) => {
  /* const { error } = UAuthValidator.loginSchema.validate(req.body);
    if (error) {
        console.log(error)
        res.status(statusCodes.badRequest).send(error.details[0].message);
        return;
    }
*/

  try {
    console.log("req body", req.body);

    const token = await authService.OathUser(req.body);
    log("token", token);
    log("token bool ", !token.message);
    if (!token.message) {
      log("token enter here");
      return res
        .status(statusCodes.ok)
        .send({ ...token, UserID: Number(token.UserID) });
    } else {
      res.status(statusCodes.badRequest).send({ error: token?.message });
    }
  } catch (error: any) {
    res.status(statusCodes.badRequest).send({ error: error.message });
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
    console.log(
      "----------------------------        verify       ------------------------"
    );

    console.log(isEmailProvided, data);
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
