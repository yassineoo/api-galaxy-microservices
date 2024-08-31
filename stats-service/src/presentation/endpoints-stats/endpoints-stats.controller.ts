import { NextFunction, Response } from "express";
import TryCatch from "../../infrastructure/api/try-catch.helper";
import { config as envConfig } from "dotenv";
import getEndpointsErrorCallsValidator from "../../contracts/endpoint-stats/get-endpoints-error-calls/get-endpoints-error-calls.request";
import { DB } from "../../infrastructure/database";
import { get_stats } from "../../application/services/endpoints-stats/get-endpoints-stats/get_endpoints_stats.service";
import { AuthRequest } from "../../infrastructure/api/auth-request";
import get_user_id_from_request from "../_common/helpers/get-user-id-from-request.helper";
envConfig()


async function get_endpoints_stats(req: AuthRequest, res: Response, next: NextFunction) {
  return await TryCatch(res, async () => {
    const userId = get_user_id_from_request(req, next)
    const { duration } = getEndpointsErrorCallsValidator.query.parse(req.query)
    const { endpoint_ids } = getEndpointsErrorCallsValidator.body.parse(req.body)
    console.log({ duration })
    const results = await get_stats(duration, endpoint_ids, userId)

    return res.status(200).send(results)
  })
}

export default { get_endpoints_stats }

