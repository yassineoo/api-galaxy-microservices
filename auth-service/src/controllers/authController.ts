import { NextFunction, Response } from "express";
import { statusCodes } from "../utils/http";
import authService from "../services/authService";
import { Role } from "../models/enum";
import { Request } from "../types";
import { sendMessage,connectProducer } from "../config/kafka"
require("dotenv").config();


// connect producer 
//connectProducer()

export const signup = (role: string) => {
  return async (req: Request, res: Response) => {
    try {
      const tokenData = await authService.register(req.body, role as Role);
      return res.status(statusCodes.ok).json(tokenData);
    } catch (error: any) {
      const { message, statusCode = statusCodes.badRequest } = error;
      return res.status(statusCode).json({ message });
    }
  };
};

export const login = async (req: Request, res: Response) => {
  try {
    const token = await authService.login(req.body) as any;
    console.log("token",token)
    if (!token.message) {
      return res.status(statusCodes.ok).send({ ...token });
    } else {
      return res.json({ message: token?.message });
    }
  } catch (error: any) {
    console.log("hello 2")
    res.status(statusCodes.badRequest).send({ error: error?.message });
  }
};

export const Oauthlogin = async (req: Request, res: Response) => {
  try {
    //console.log("called from backend");
    const token = await authService.OathUser(req.body);
    //console.log("token", token);
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



export const activateTwoFactors = async(req:Request,res:Response,next:NextFunction)=>{
  try {
    const userId = req.params.userId
    if(!userId){
      throw Error("invalid userId")
    }
    await authService.activateTwoFactors(userId)
    return res.status(200).send(true)
  } catch (error) {
    next(error)
  }
}

export const verifyOTP=async (req:Request,res:Response,next:NextFunction)=>{
  try {
    const {otp,userId} = req.body
    await authService.verifyOTP(userId,otp)
    res.status(200).send(true)
  } catch (error) {
    next(error)
  }
}