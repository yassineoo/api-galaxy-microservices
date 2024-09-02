import { NextFunction, Request, Response } from "express";
import apiService from "../services/apiService";
import { collectionsService } from "../services/collections.service";

function getAllApisByCategory(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        console.log({ params: req.params, query: req.query })
        const page = Number(req.query?.page)
        if (!id) {
            throw new Error("categoryName is not valid");
        }

        const apis = collectionsService.getAllApisByCategory({ id: Number(id), page: page || 1 });
        res.status(200).send(apis);
    } catch (error) {
        next(error);
    }
}

export const collectionsController = { getAllApisByCategory }