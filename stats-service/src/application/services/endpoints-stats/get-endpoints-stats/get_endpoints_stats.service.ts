import { Duration, ID } from "../../../../contracts/endpoint-stats/_common";
import { success_status_code_range } from "../../../../infrastructure/api/http";
import { DB } from "../../../../infrastructure/database";
import { getTimePeriods, Period } from "../../_common/get-time-periods";

export async function get_stats(duration: Duration, endpoint_ids: ID[], userId: ID) {

    const periods = getTimePeriods(duration)

    const results = await Promise.all(
        periods.map(async period => getStatsInPeriod(period, endpoint_ids, userId))
    )

    console.log({ results })
    return results
}

async function getStatsInPeriod(period: Period, endpoint_ids: ID[], userId: ID) {

    const stats = await Promise.all(endpoint_ids.map(
        async endpoint_id => {
            const [success, error, latency] = await Promise.all([
                getEndpointSuccessCallsInPeriod(period, endpoint_id, userId),
                getEndpointErrroCallsInPeriod(period, endpoint_id, userId),
                getEndpointCallsLatencyInPeriod(period, endpoint_id, userId),
            ])
            return ({
                name: period.name,
                [endpoint_id.toString()]: {
                    Calls: success,
                    Errors: error,
                    Latency: latency
                }
            })
        }
    ))
    // console.log({ stats })

    const prettyStats = stats.reduce((acc, curr) => ({ ...acc, ...curr }), {})

    console.log({ prettyStats })

    return prettyStats
}
async function getEndpointSuccessCallsInPeriod(period: Period, endpoint_id: ID, userId: ID): Promise<number> {
    const success = await DB.usage_log_entities.aggregate({
        where: {
            endpoint_id,
            endpoints_entities: {
                endpoints_group_entities: {
                    api_entities: {
                        user_entities: {
                            id: userId
                        }
                    }
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
    return success._count
}

async function getEndpointErrroCallsInPeriod(period: Period, endpoint_id: ID, userId: ID): Promise<number> {
    const error = await DB.usage_log_entities.aggregate({
        where: {
            endpoint_id,
            endpoints_entities: {
                endpoints_group_entities: {
                    api_entities: {
                        user_entities: {
                            id: userId
                        }
                    }
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
    return error._count
}
async function getEndpointCallsLatencyInPeriod(period: Period, endpoint_id: ID, userId: ID): Promise<number> {
    const latency = await DB.usage_log_entities.aggregate({
        where: {
            endpoint_id,
            endpoints_entities: {
                endpoints_group_entities: {
                    api_entities: {
                        user_entities: {
                            id: userId
                        }
                    }
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

    return latency._avg.response_time ?? 0
}