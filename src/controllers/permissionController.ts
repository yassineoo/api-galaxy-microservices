import { NextFunction, Request, Response } from 'express'
import { decodeAuthToken } from '../utils/token';

require('dotenv').config();
const tokenSecret = process.env.TOKEN_SECRET;

export const verifyAuth = async (req: Request, res: Response, next: NextFunction) => {


    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            throw new Error('No token provided');
        }

        const tokenData  = decodeAuthToken(token, tokenSecret || "");

        if (!tokenData) {
            throw new Error('Invalid token');
        }

        
    }
    catch (error:any) {
        res.status(401).send(error.message);
        return;
    }
}