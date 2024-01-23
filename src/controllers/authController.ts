import { NextFunction, Request, Response } from 'express'
import { decodeAuthToken } from '../utils/token';
import { getUserById } from '../models/userModel';
import { loginService, registerService } from '../services/authService';
import UAuthValidator from '../validators/UAuthValidator';
import { statusCodes } from '../utils/http';


require('dotenv').config();
const tokenSecret = process.env.TOKEN_SECRET;

export const signup = async (req: Request, res: Response) => {
    
    const { error } = UAuthValidator.signUpSchema.validate(req.body);
    if (error) {
        res.status(statusCodes.badRequest).send(error.details[0].message);
        return;
    }

    try {
        const token = await registerService(req.body);
        res.status(statusCodes.ok).send({ token });
    } catch (error :any) {
        res.status(statusCodes.badRequest).send(error.message);
    }
}

export const login = async (req: Request, res: Response) => {

    console.log(req.body);
    const { error } = UAuthValidator.loginSchema.validate(req.body);
    if (error) {
        res.status(statusCodes.badRequest).send(error.details[0].message);
        return;
    }

    try {
        const token = await loginService(req.body);
        res.status(statusCodes.ok).send({ token });
    } catch (error:any) {
        res.status(statusCodes.badRequest).send({ error: error.message });
    }
}



export const verifyAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            throw new Error('No token provided');
        }


        const decodedToken: any = decodeAuthToken(token, tokenSecret || "");
        if (!decodedToken) {
            throw new Error('Invalid token');
        }


        const user = await getUserById(decodedToken.userId);
        if (!user) {
            throw new Error('User not found');
        }
        req.body.user = user;

        next();
    } catch (error :any) {
        res.status(401).send( error.message);
    }
}
