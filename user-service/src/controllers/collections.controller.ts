import { NextFunction, Request, Response } from "express";
import apiService from "../services/apiService";
import { collectionsService } from "../services/collections.service";

async function getAllApisByCategory(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        console.log({ params: req.params, query: req.query })
        // const page = Number(req.query?.page)
        if (!id) {
            throw new Error("categoryName is not valid");
        }

        const apis = await collectionsService.getAllApisByCategory({ id: Number(id) });
        console.log({ apis })
        return res.status(200).send(apis);
    } catch (error) {
        next(error);
    }
}

export const collectionsController = { getAllApisByCategory }