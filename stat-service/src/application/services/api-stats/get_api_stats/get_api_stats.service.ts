import { Duration, ID } from "../../../../contracts/endpoint-stats/_common";
import { success_status_code_range } from "../../../../infrastructure/api/http";
import { DB } from "../../../../infrastructure/database";
import { getTimePeriods, Period } from "../../_common/get-time-periods";

export default async function get_apis_stats_service(api_ids: ID[], duration: Duration) {
    const periods = getTimePeriods(duration)

    const results = await Promise.all(periods.map(period => get_apis_stats_in_period(period, api_ids)))

    return results;
}

async function get_apis_stats_in_period(period: Period, api_ids: ID[]) {
    const results = await Promise.all(api_ids.map(
        async api_id => {
            const [success, error, latency] = await Promise.all([
                get_api_success_calls_in_period(period, api_id),
                get_api_error_calls_in_period(period, api_id),
                get_api_calls_latency_in_period(period, api_id),
            ])
            return ({
                name: period.name,
                [api_id.toString()]: {
                    Calls: success,
                    Errors: error,
                    Latency: latency
                }
            })
        }
    ))

    const prettyStats = results.reduce((acc, curr) => ({ ...acc, ...curr }), {})

    console.log({ prettyStats })

    return prettyStats
}

async function get_api_success_calls_in_period(period: Period, api_id: ID) {
    const success = await DB.usage_log_entities.aggregate({
        where: {
            endpoints_entities: {
                endpoints_group_entities: {
                    api_id
                }
            },
            status: {
                in: success_status_code_range
            },
            timestamp: {
                lte: period.endDate,
                gte: period.startDate
            }
        },
        _count: true
    })
    return success._count ?? 0
}

async function get_api_error_calls_in_period(period: Period, api_id: ID) {
    const errors = await DB.usage_log_entities.aggregate({
        where: {
            endpoints_entities: {
                endpoints_group_entities: {
                    api_id
                }
            },
            status: {
                notIn: success_status_code_range
            },
            timestamp: {
                lte: period.endDate,
                gte: period.startDate
            }
        },
        _count: true
    })
    return errors._count ?? 0
}

async function get_api_calls_latency_in_period(period: Period, api_id: ID) {
    const success = await DB.usage_log_entities.aggregate({
        where: {
            endpoints_entities: {
                endpoints_group_entities: {
                    api_id
                }
            },
            status: {
                in: success_status_code_range
            },
            timestamp: {
                lte: period.endDate,
                gte: period.startDate
            }
        },
        _avg: {
            response_time: true
        }
    })
    return success._avg.response_time ?? 0
}