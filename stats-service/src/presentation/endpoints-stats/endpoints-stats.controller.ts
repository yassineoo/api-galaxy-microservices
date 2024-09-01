import { Request, Response } from "express";
import TryCatch from "../../infrastructure/api/try-catch.helper";
import getEndpointsSuccessCallsValidator from "../../contracts/endpoint-stats/get-endpoints-success-calls/get-endpoints-success-calls.request";
import { config as envConfig } from "dotenv";
import getEndpointsErrorCallsValidator from "../../contracts/endpoint-stats/get-endpoints-error-calls/get-endpoints-error-calls.request";
import { DB } from "../../infrastructure/database";
import { get_stats } from "../../application/services/endpoints-stats/get-endpoints-stats/get_endpoints_stats.service";
envConfig()


async function get_endpoints_stats(req: Request, res: Response) {
  return await TryCatch(res, async () => {
    const { duration } = getEndpointsErrorCallsValidator.query.parse(req.query)
    const { endpoint_ids } = getEndpointsErrorCallsValidator.body.parse(req.body)
    console.log({ duration })
    const results = await get_stats(duration, endpoint_ids)

    return res.status(200).send(results)
  })
}

export default { get_endpoints_stats }

