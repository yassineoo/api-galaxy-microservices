import { NextFunction, Response } from "express";
import TryCatch from "../../infrastructure/api/try-catch.helper";
import { get_api_stats_body_validator, get_api_stats_query_validator } from "../../contracts/api-stats/get_api_stats.request";
import get_apis_stats_service from "../../application/services/api-stats/get_api_stats/get_api_stats.service";
import { AuthRequest } from "../../infrastructure/api/auth-request";
import get_user_id_from_request from "../_common/helpers/get-user-id-from-request.helper";

async function get_apis_stats(req: AuthRequest, res: Response, next: NextFunction) {
    return await TryCatch(res, async () => {
        const userId = get_user_id_from_request(req, next);

        const { api_ids } = get_api_stats_body_validator.parse(req.body)
        const { duration } = get_api_stats_query_validator.parse(req.query)
        console.log({ duration })
        const results = await get_apis_stats_service(api_ids, duration, userId)

        return res.json(results).status(200)
    })
}

export default { get_apis_stats }