import { NextFunction, Request, Response } from 'express'
import UAuthValidator from '../validators/UAuthValidator';
import { statusCodes } from '../utils/http';
import authService from '../services/authService';

require('dotenv').config();
const tokenSecret = process.env.TOKEN_SECRET;



export const signup = (role: string) => {
    return async (req: Request, res: Response) => {

        const { error } = UAuthValidator.signUpSchema.validate(req.body);
        if (error) {
            res.status(statusCodes.badRequest).send(error.details[0].message);
            return;
        }

        try {
            const token = await authService.register(req.body, "userClient");
            res.status(statusCodes.ok).send({ token });
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


