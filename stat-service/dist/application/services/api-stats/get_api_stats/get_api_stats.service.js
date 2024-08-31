"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("../../../../infrastructure/api/http");
const database_1 = require("../../../../infrastructure/database");
const get_time_periods_1 = require("../../_common/get-time-periods");
async function get_apis_stats_service(api_ids, duration, userId) {
    const periods = (0, get_time_periods_1.getTimePeriods)(duration);
    const results = await Promise.all(periods.map(period => get_apis_stats_in_period(period, api_ids, userId)));
    return results;
}
exports.default = get_apis_stats_service;
async function get_apis_stats_in_period(period, api_ids, userId) {
    const results = await Promise.all(api_ids.map(async (api_id) => {
        const [success, error, latency] = await Promise.all([
            get_api_success_calls_in_period(period, api_id, userId),
            get_api_error_calls_in_period(period, api_id, userId),
            get_api_calls_latency_in_period(period, api_id, userId),
        ]);
        return ({
            name: period.name,
            [api_id.toString()]: {
                Calls: success,
                Errors: error,
                Latency: latency
            }
        });
    }));
    const prettyStats = results.reduce((acc, curr) => ({ ...acc, ...curr }), {});
    console.log({ prettyStats });
    return prettyStats;
}
async function get_api_success_calls_in_period(period, api_id, userId) {
    const success = await database_1.DB.usage_log_entities.aggregate({
        where: {
            endpoints_entities: {
                endpoints_group_entities: {
                    api_id,
                    api_entities: {
                        user_entities: {
                            id: userId
                        }
                    }
                },
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
    return success._count ?? 0;
}
async function get_api_error_calls_in_period(period, api_id, userId) {
    const errors = await database_1.DB.usage_log_entities.aggregate({
        where: {
            endpoints_entities: {
                endpoints_group_entities: {
                    api_id,
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
    return errors._count ?? 0;
}
async function get_api_calls_latency_in_period(period, api_id, userId) {
    const success = await database_1.DB.usage_log_entities.aggregate({
        where: {
            endpoints_entities: {
                endpoints_group_entities: {
                    api_id,
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
    return success._avg.response_time ?? 0;
}
