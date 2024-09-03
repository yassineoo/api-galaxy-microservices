import { Router } from "express";
import { collectionsController } from "../controllers/collections.controller";

const route = Router()

route.get("/:id", collectionsController.getAllApisByCategory)

export default route