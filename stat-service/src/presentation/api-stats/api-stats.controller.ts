import { Request, Response } from "express";
import TryCatch from "../../infrastructure/api/try-catch.helper";
import { get_api_stats_body_validator, get_api_stats_query_validator } from "../../contracts/api-stats/get_api_stats.request";
import get_apis_stats_service from "../../application/services/api-stats/get_api_stats/get_api_stats.service";

async function get_api_stats(req: Request, res: Response) {
    return await TryCatch(res, async () => {
        const { api_ids } = get_api_stats_body_validator.parse(req.body)
        const { duration } = get_api_stats_query_validator.parse(req.query)
        console.log({ duration })
        const results = await get_apis_stats_service(api_ids, duration)

        return res.json(results).status(200)
    })
}

export default { get_api_stats }