import express from "express";
import { deleteUser } from "../controllers/UAMController";

const UAMRouter = express.Router();

UAMRouter.delete("/deleteUser/:id", deleteUser);

export default UAMRouter;
