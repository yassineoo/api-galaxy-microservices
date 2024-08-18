import { Request, Response } from "express";
import TryCatch from "../../infrastructure/api/try-catch.helper";
import getEndpointsSuccessCallsValidator from "../../contracts/endpoint-stats/get-endpoints-success-calls/get-endpoints-success-calls.request";
import { config as envConfig } from "dotenv";
import get_endpoints_success_calls_service from "../../application/services/endpoints-stats/get-endpoints-success-calls/get-endpoints-success-calls.service";
import get_endpoints_error_calls_service from "../../application/services/endpoints-stats/get-endpoints-error-calls/get-endpoints-error-calls.service";
import getEndpointsErrorCallsValidator from "../../contracts/endpoint-stats/get-endpoints-error-calls/get-endpoints-error-calls.request";
import get_endpoints_calls_latency_service from "../../application/services/endpoints-stats/get-endpoints-calls-latency/get-endpoints-calls-latency.service";
import { get_endpoints_calls_service, get_stats } from "../../application/services/endpoints-stats/get-endpoints-success-calls/get_endpoint_success_calls.service";
import { DB } from "../../infrastructure/database";
envConfig()

async function get_endpoints_success_calls(req: Request, res: Response) {
  return await TryCatch(res, async () => {
    const { duration } = getEndpointsSuccessCallsValidator.query.parse(req.query)
    const { endpoint_ids } = getEndpointsErrorCallsValidator.body.parse(req.body)

    const stats = await get_endpoints_success_calls_service(duration, endpoint_ids)

    return res.status(200).send(stats)
  })
}

async function get_endpoints_error_calls(req: Request, res: Response) {
  return await TryCatch(res, async () => {
    const { duration } = getEndpointsErrorCallsValidator.query.parse(req.query)
    const { endpoint_ids } = getEndpointsErrorCallsValidator.body.parse(req.body)

    const stats = await get_endpoints_error_calls_service(duration, endpoint_ids)

    return res.status(200).send(stats)
  })
}

async function get_endpoints_calls_latency(req: Request, res: Response) {
  return await TryCatch(res, async () => {
    const { duration } = getEndpointsErrorCallsValidator.query.parse(req.query)
    const { endpoint_ids } = getEndpointsErrorCallsValidator.body.parse(req.body)

    const stats = await get_endpoints_calls_latency_service(duration, endpoint_ids)

    return res.status(200).send(stats)
  })
}

async function get_all_endpoints_stats(req: Request, res: Response) {
  return await TryCatch(res, async () => {
    const { duration } = getEndpointsErrorCallsValidator.query.parse(req.query)
    const { endpoint_ids } = getEndpointsErrorCallsValidator.body.parse(req.body)

    const [calls, errors, latency] = await Promise.all([
      get_endpoints_success_calls_service(duration, endpoint_ids),
      get_endpoints_error_calls_service(duration, endpoint_ids),
      get_endpoints_calls_latency_service(duration, endpoint_ids)
    ])

    return res.status(200).send({ calls, errors, latency })
  })
}

async function get_endpoints_calls(req: Request, res: Response) {
  return await TryCatch(res, async () => {
    const { duration } = getEndpointsErrorCallsValidator.query.parse(req.query)
    const { endpoint_ids } = getEndpointsErrorCallsValidator.body.parse(req.body)

    const results = await get_endpoints_calls_service(duration, endpoint_ids)

    return res.status(200).send(results)
  })
}

async function getStats(req: Request, res: Response) {
  return await TryCatch(res, async () => {
    const { duration } = getEndpointsErrorCallsValidator.query.parse(req.query)
    const { endpoint_ids } = getEndpointsErrorCallsValidator.body.parse(req.body)
    console.log({ duration })
    const results = await get_stats(duration, endpoint_ids)

    return res.status(200).send(results)
  })
}

export default { get_endpoints_success_calls, get_endpoints_error_calls, get_endpoints_calls_latency, get_all_endpoints_stats, get_endpoints_calls, getStats }

