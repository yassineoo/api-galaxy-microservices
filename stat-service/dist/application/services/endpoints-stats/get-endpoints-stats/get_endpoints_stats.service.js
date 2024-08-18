"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_stats = void 0;
const http_1 = require("../../../../infrastructure/api/http");
const database_1 = require("../../../../infrastructure/database");
const get_time_periods_1 = require("../../_common/get-time-periods");
// export async function get_endpoint_success_calls_service(duration: Duration, endpoint_id: ID) {
//     const periods = getTimePeriods(duration)
//     const calls = await Promise.all(periods.map(
//         async period => {
//             const call = await DB.usage_log_entities.aggregate({
//                 where: {
//                     endpoint_id,
//                     status: {
//                         in: success_status_code_range
//                     },
//                     timestamp: {
//                         lte: period.endDate,
//                         gte: period.startDate
//                     }
//                 },
//                 _count: true
//             })
//             return { value: call._count, name: period.name }
//         })
//     )
//     return calls
// }
// export async function get_endpoint_error_calls_service(duration: Duration, endpoint_id: ID) {
//     const periods = getTimePeriods(duration)
//     const errors = await Promise.all(periods.map(
//         async period => {
//             const call = await DB.usage_log_entities.aggregate({
//                 where: {
//                     endpoint_id,
//                     status: {
//                         notIn: success_status_code_range
//                     },
//                     timestamp: {
//                         lte: period.endDate,
//                         gte: period.startDate
//                     }
//                 },
//                 _count: true
//             })
//             return { value: call._count, name: period.name }
//         })
//     )
//     return errors
// }
// export default async function get_endpoint_calls_latency_service(duration: Duration, endpoint_id: ID) {
//     const periods = getTimePeriods(duration)
//     const calls = await Promise.all(periods.map(
//         async period => {
//             const call = await DB.usage_log_entities.aggregate({
//                 where: {
//                     endpoint_id,
//                     status: {
//                         in: success_status_code_range
//                     },
//                     timestamp: {
//                         lte: period.endDate,
//                         gte: period.startDate
//                     }
//                 },
//                 _avg: {
//                     response_time: true
//                 }
//             })
//             return { value: call._avg.response_time ?? 0, name: period.name }
//         })
//     )
//     return calls
// }
// export async function get_endpoint_calls(duration: Duration, endpoint_id: ID) {
//     const [calls, errors, latency] = await Promise.all([
//         get_endpoint_success_calls_service(duration, endpoint_id),
//         get_endpoint_error_calls_service(duration, endpoint_id),
//         get_endpoint_calls_latency_service(duration, endpoint_id),
//     ])
//     return {
//         Calls: calls,
//         Errors: errors,
//         Latency: latency
//     }
// }
// export async function get_endpoints_calls_service(duration: Duration, endpoint_ids: ID[]) {
//     const endpoint_names = await DB.endpoints_entities.findMany({
//         where: {
//             id: {
//                 in: endpoint_ids
//             }
//         },
//         select: {
//             id: true,
//             name: true
//         }
//     })
//     // TODO
//     const results = await Promise.all(
//         endpoint_ids.map(
//             async endpoint_id => {
//                 return { [endpoint_names.find(r => r.id === endpoint_id)?.name as string]: await get_endpoint_calls(duration, endpoint_id) }
//             }
//         )
//     )
//     return results
// }
async function get_stats(duration, endpoint_ids) {
    const periods = (0, get_time_periods_1.getTimePeriods)(duration);
    const results = await Promise.all(periods.map(async (period) => getStatsInPeriod(period, endpoint_ids)));
    console.log({ results });
    return results;
}
exports.get_stats = get_stats;
async function getStatsInPeriod(period, endpoint_ids) {
    const stats = await Promise.all(endpoint_ids.map(async (endpoint_id) => {
        const [success, error, latency] = await Promise.all([
            getEndpointSuccessCallsInPeriod(period, endpoint_id),
            getEndpointErrroCallsInPeriod(period, endpoint_id),
            getEndpointCallsLatencyInPeriod(period, endpoint_id),
        ]);
        return ({
            name: period.name,
            [endpoint_id.toString()]: {
                Calls: success,
                Errors: error,
                Latency: latency
            }
        });
    }));
    // console.log({ stats })
    const prettyStats = stats.reduce((acc, curr) => ({ ...acc, ...curr }), {});
    console.log({ prettyStats });
    return prettyStats;
}
async function getEndpointSuccessCallsInPeriod(period, endpoint_id) {
    const success = await database_1.DB.usage_log_entities.aggregate({
        where: {
            endpoint_id,
            status: {
                in: http_1.success_status_code_range
            },
            timestamp: {
                lte: period.endDate,
                gte: period.startDate
            }
        },
        _count: true
    });
    return success._count;
}
async function getEndpointErrroCallsInPeriod(period, endpoint_id) {
    const error = await database_1.DB.usage_log_entities.aggregate({
        where: {
            endpoint_id,
            status: {
                notIn: http_1.success_status_code_range
            },
            timestamp: {
                lte: period.endDate,
                gte: period.startDate
            }
        },
        _count: true
    });
    return error._count;
}
async function getEndpointCallsLatencyInPeriod(period, endpoint_id) {
    const latency = await database_1.DB.usage_log_entities.aggregate({
        where: {
            endpoint_id,
            status: {
                in: http_1.success_status_code_range
            },
            timestamp: {
                lte: period.endDate,
                gte: period.startDate
            }
        },
        _avg: {
            response_time: true
        }
    });
    return latency._avg.response_time ?? 0;
}
