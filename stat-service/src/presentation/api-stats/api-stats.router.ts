import express from "express"
import controller from "./api-stats.controller"


const router = express.Router()

router.post("/", controller.get_api_stats)

export default router