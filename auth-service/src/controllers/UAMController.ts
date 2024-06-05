import { Request, Response } from 'express'
import { statusCodes } from '../utils/http';
import userService from '../services/UAMService';
import UAMValidator from '../validators/UAMValidator';
import followsModel from '../models/follows';

export const getUserById = async (req: Request, res: Response) => {

    if ((!req.params) || (req.params.id === undefined)) {
        res.status(statusCodes.badRequest).send("User not found");
        return;
    }

    try {
        const user = await userService.getUserById(parseInt(req.params.id));
        res.status(statusCodes.ok).send(user);
    } catch (error) {
        res.status(statusCodes.serverError).send("Internal server error");
    }
}


export const getAllUsers = async (req: Request, res: Response) => {

    try {
        const users = await userService.getAllUsers();
        res.status(statusCodes.ok).send(users);
    } catch (error) {
        res.status(statusCodes.serverError).send("Internal server error");
    }
}


export const updateUser = async (req: Request, res: Response) => {

    const { error } = UAMValidator.updateSchema.validate(req.body);
    if (error) {
        res.status(statusCodes.badRequest).send(error.details[0].message);
        return;
    }

    if ((!req.params) || (req.params.id === undefined)) {
        res.status(statusCodes.badRequest).send("User not found");
        return;
    }

    try {
        const user = await userService.updateUser(parseInt(req.params.id), req.body);
        res.status(statusCodes.ok).send(user);
        return;
    } catch (error) {
        return res.status(statusCodes.serverError).send("Internal server error");
    }

}

export const updateUserRole = async (req: Request, res: Response) => {
    
        const { error } = UAMValidator.updateRoleSchema.validate(req.body);
        if (error) {
            res.status(statusCodes.badRequest).send(error.details[0].message);
            return;
        }
    
        if ((!req.params) || (req.params.id === undefined)) {
            res.status(statusCodes.badRequest).send("User not found");
            return;
        }
    
        try {
            const user = await userService.updateRole(parseInt(req.params.id), req.body.role);
            res.status(statusCodes.ok).send(user);
            return;
        } catch (error) {
            return res.status(statusCodes.serverError).send("Internal server error");
        }
}


export const deleteUser = async (req: Request, res: Response) => {

    if ((!req.params) || (req.params.id === undefined)) {
        res.status(statusCodes.badRequest).send("User not found");
        return;
    }

    try {
        await userService.deleteUser(parseInt(req.params.id));
        res.status(statusCodes.ok).send("User deleted successfully");
    } catch (error) {
        res.status(statusCodes.serverError).send("Internal server error");
    }
}

export const followUser = async (req: Request, res: Response) => {
        try {
            await followsModel.followUser(
                {   
                   userId: req.userId as number, 
                   followingId: parseInt(req.body.followingId)
                }
                );
            res.status(statusCodes.ok).send("User followed successfully");
        } catch (error) {
            res.status(statusCodes.serverError).send("Internal server error");
        }
    }