import express, { Request, Response } from "express";
import controller from "./endpoints-stats.controller"

const router = express.Router();

router.post("/oauth", (req, res) => {
  res.send("oauth");
});


// Get Succes calls of an api , api_id is the id of the api , and the duration query for the last month , week , year ...
// router.post("/success/endpoints", controller.get_endpoints_success_calls)
// router.post("/error/endpoints", controller.get_endpoints_error_calls)
// router.post("/latency/endpoints", controller.get_endpoints_calls_latency)
// router.post("/all/endpoints", controller.get_all_endpoints_stats)
// router.get("/", (req: Request, res: Response) => {
//   return res.send({ message: "HELLO WORLD" })
// })
-
router.post("/", controller.getStats)

// router.post("/endpoints", controller.get_endpoints_calls)

// router.get("/success/api/:api_id")
// router.get("/error/api/:api_id")


export default router;
