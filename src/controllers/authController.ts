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


