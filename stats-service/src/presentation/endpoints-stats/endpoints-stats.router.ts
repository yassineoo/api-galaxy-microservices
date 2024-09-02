import express from "express";
import controller from "./endpoints-stats.controller";

const router = express.Router();

router.post("/", controller.get_endpoints_stats);

export default router;
