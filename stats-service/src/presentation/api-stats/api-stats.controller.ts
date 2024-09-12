import { NextFunction, Response } from "express";
import TryCatch from "../../infrastructure/api/try-catch.helper";
import {
  get_api_stats_body_validator,
  get_api_stats_query_validator,
} from "../../contracts/api-stats/get_api_stats.request";
import { AuthRequest } from "../../infrastructure/api/auth-request";
import get_apis_stats_service from "../../application/services/api-stats/get_api_stats/get_api_stats.service";
import get_apis_stats_service_donut from "../../application/services/api-stats/get_api_stats/get_api_stats_donut";

async function get_apis_stats(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  return await TryCatch(res, async () => {
    const userId = 1 as unknown as bigint;

    const { api_ids } = get_api_stats_body_validator.parse(req.body);
    const { duration } = get_api_stats_query_validator.parse(req.query);
    console.log({ duration, api_ids });
    const results = await get_apis_stats_service(api_ids, duration, userId);
    console.log("stat-debug finsih ", { results });

    return res.json(results).status(200);
  });
}

async function get_apis_stats_donut(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  return await TryCatch(res, async () => {
    const { api_ids } = get_api_stats_body_validator.parse(req.body);
    console.log({ api_ids });
    const results = await get_apis_stats_service_donut(api_ids);
    console.log("stat-debug finsih ", { results });

    return res.json(results).status(200);
  });
}
export default { get_apis_stats, get_apis_stats_donut };
