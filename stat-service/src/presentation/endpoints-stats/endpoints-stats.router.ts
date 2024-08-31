import express from "express";
import controller from "./endpoints-stats.controller"
import authenticate from "../_common/middlewares/authenticate.middleware";

const router = express.Router();

router.post("/", authenticate, controller.get_endpoints_stats)


export default router;
