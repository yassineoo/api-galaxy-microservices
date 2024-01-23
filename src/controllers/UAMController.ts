import { Request, Response } from 'express'

import { deleteAccount } from "../services/UAMService"
import { statusCodes } from '../utils/http';

export const deleteUser = async (req: Request, res: Response) => {

    if ((!req.params) || (req.params.id === undefined)) {
        res.status(statusCodes.badRequest).send("User not found"); 
        return;
    }

    try {
        await deleteAccount(parseInt(req.params.id));
        res.status(statusCodes.ok).send("User deleted successfully");
    } catch (error) {
        res.status(statusCodes.serverError).send("Internal server error");
    }
}