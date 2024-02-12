import { NextFunction, Request, Response } from 'express'
import UAuthValidator from '../validators/UAuthValidator';
import { statusCodes } from '../utils/http';
import authService from '../services/authService';
import { Role } from '../models/enum';
import { SendVerificationEmail } from '../services/grpcClient/notifService';
import { decodeEmailToken, generateAuthToken, generateEmailToken } from '../utils/token';
import userService from '../services/UAMService';

require('dotenv').config();
const tokenSecret = process.env.TOKEN_SECRET;
const expiresIn = process.env.EXPIRES_IN;

const emailTokenSecret = process.env.EMAIL_TOKEN_SECRET;
const emailTokenExpiry = process.env.EMAIL_TOKEN_EXPIRY;


export const signup = (role: string) => {
    return async (req: Request, res: Response) => {

        const { error } = UAuthValidator.signUpSchema.validate(req.body);
        if (error) {
            res.status(statusCodes.badRequest).send(error.details[0].message);
            return;
        }

        try {
            const tokenData = await authService.register(req.body, role as Role);
            const emailToken = generateEmailToken(req.body.Email, emailTokenSecret || "", emailTokenExpiry || "");
            await SendVerificationEmail({ email: req.body.Email, name: req.body.Username, token: emailToken });
            res.status(statusCodes.ok).send({
                message: "signed up with success , email sent",
                emailToken: emailToken,
                loginToken: tokenData

            });
        } catch (error: any) {
            res.status(statusCodes.badRequest).send(error.message);
        }
    }
}

export const login = async (req: Request, res: Response) => {
    const { error } = UAuthValidator.loginSchema.validate(req.body);
    if (error) {
        res.status(statusCodes.badRequest).send(error.details[0].message);
        return;
    }

    try {
        const token = await authService.login(req.body);
        res.status(statusCodes.ok).send({ token });
    } catch (error: any) {
        res.status(statusCodes.badRequest).send({ error: error.message });
    }
}

//requires being logged in
export const resendVerificationEmail = async (req: Request, res: Response) => {
    try {
        if (req.userId == null) {
            throw new Error("User not found")
        }
        authService.resendVerificationEmail(req.userId);
        res.status(statusCodes.ok).send("Email sent");
    } catch (error: any) {
        res.status(statusCodes.badRequest).send({ error: error.message });
    }
}

//requires a token to be sent in the link and being logged in
export const verifyEmail = async (req: Request, res: Response) => {
    try {
        const token = req.params.token;
        if (!token) {
            throw new Error("Token not found");
        }
        if (req.userId == null) {
            throw new Error("Not authentified");
        }
       
        authService.verifyEmail(req.userId, token);

    } catch (error: any) {
        res.status(statusCodes.badRequest).send({ error: error.message });
    }
}

