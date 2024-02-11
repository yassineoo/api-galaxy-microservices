import { Request, Response } from 'express'
import { statusCodes } from '../utils/http';
import UPMValidator from '../validators/UPMValidator';
import UPMService from '../services/UPMService';

export const getProfileById = async (req: Request, res: Response) => {

    if ((!req.params) || (req.params.id === undefined)) {
        res.status(statusCodes.badRequest).send("Profile not found");
        return;
    }
    try {
        const profile = await UPMService.getProfileById(parseInt(req.params.id));
        res.status(statusCodes.ok).send(profile);
    } catch (error) {
        res.status(statusCodes.serverError).send("Internal server error");
    }
}

export const getAllProfiles = async (req: Request, res: Response) => {

    try {
        const profiles = await UPMService.getAllProfiles();
        res.status(statusCodes.ok).send(profiles);
    } catch (error) {
        res.status(statusCodes.serverError).send("Internal server error");
    }
}

export const updateProfileById = async (req: Request, res: Response) => {
    if ((!req.params) || (req.params.id === undefined)) {
        res.status(statusCodes.badRequest).send("Profile not found");
        return;
    }

    try {
        const profile = await UPMService.updateProfileById(parseInt(req.params.id), req.body);
        res.status(statusCodes.ok).send(profile);
    } catch (error) {
        res.status(statusCodes.serverError).send("Internal server error");
    }
}

export const deleteProfileById = async (req: Request, res: Response) => {
    if ((!req.params) || (req.params.id === undefined)) {
        res.status(statusCodes.badRequest).send("Profile not found");
        return;
    }

    try {
        const profile = await UPMService.deleteProfileById(parseInt(req.params.id));
        res.status(statusCodes.ok).send(profile);
    } catch (error) {
        res.status(statusCodes.serverError).send("Internal server error");
    }
}



export const getProfilesByUserId = async (req: Request, res: Response) => {
    if ((!req.params) || (req.params.id === undefined)) {
        res.status(statusCodes.badRequest).send("Profile not found");
        return;
    }

    try {
        const profile = await UPMService.getProfilesByUserId(parseInt(req.params.id));
        res.status(statusCodes.ok).send(profile);
    } catch (error) {
        res.status(statusCodes.serverError).send("Internal server error");
    }
}


export const deleteAllUserProfiles = async (req: Request, res: Response) => {
    if ((!req.params) || (req.params.id === undefined)) {
        res.status(statusCodes.badRequest).send("Profile not found");
        return;
    }

    try {
        const profile = await UPMService.deleteAllUserProfiles(parseInt(req.params.id));
        res.status(statusCodes.ok).send(profile);
    } catch (error) {
        res.status(statusCodes.serverError).send("Internal server error");
    }
}

export const addProfileByUserId = async (req: Request, res: Response) => {
    const { error } = UPMValidator.userProfileSchema.validate(req.body);
    if (error) {
        res.status(statusCodes.badRequest).send(error.details[0].message);
        return;
    }

    try {
        const profile = await UPMService.addProfile(req.body);
        res.status(statusCodes.ok).send(profile);
    } catch (error) {
        res.status(statusCodes.serverError).send("Internal server error");
    }
}