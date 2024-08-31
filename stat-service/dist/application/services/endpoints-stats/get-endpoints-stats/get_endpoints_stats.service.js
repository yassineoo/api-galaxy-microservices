"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_stats = void 0;
const http_1 = require("../../../../infrastructure/api/http");
const database_1 = require("../../../../infrastructure/database");
const get_time_periods_1 = require("../../_common/get-time-periods");
async function get_stats(duration, endpoint_ids, userId) {
    const periods = (0, get_time_periods_1.getTimePeriods)(duration);
    const results = await Promise.all(periods.map(async (period) => getStatsInPeriod(period, endpoint_ids, userId)));
    console.log({ results });
    return results;
}
exports.get_stats = get_stats;
async function getStatsInPeriod(period, endpoint_ids, userId) {
    const stats = await Promise.all(endpoint_ids.map(async (endpoint_id) => {
        const [success, error, latency] = await Promise.all([
            getEndpointSuccessCallsInPeriod(period, endpoint_id, userId),
            getEndpointErrroCallsInPeriod(period, endpoint_id, userId),
            getEndpointCallsLatencyInPeriod(period, endpoint_id, userId),
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
async function getEndpointSuccessCallsInPeriod(period, endpoint_id, userId) {
    const success = await database_1.DB.usage_log_entities.aggregate({
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
async function getEndpointErrroCallsInPeriod(period, endpoint_id, userId) {
    const error = await database_1.DB.usage_log_entities.aggregate({
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
async function getEndpointCallsLatencyInPeriod(period, endpoint_id, userId) {
    const latency = await database_1.DB.usage_log_entities.aggregate({
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
