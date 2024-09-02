import express from "express";
import controller from "./api-stats.controller";
import authenticate from "../_common/middlewares/authenticate.middleware";

const router = express.Router();

router.use(authenticate);

router.post("/", controller.get_apis_stats);

export default router;
