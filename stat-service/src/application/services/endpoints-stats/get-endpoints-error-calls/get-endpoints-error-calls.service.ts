import { Duration, ID } from "../../../../contracts/endpoint-stats/_common";
import { success_status_code_range } from "../../../../infrastructure/api/http";
import { DB } from "../../../../infrastructure/database";
import { getTimePeriods } from "../../_common/get-time-periods";

export default async function get_endpoints_error_calls_service(duration: Duration, endpoint_ids: ID[]) {

    const periods = getTimePeriods(duration)
    const endpointNames = await DB.endpoints_entities.findMany({
        where: {
            id: {
                in: endpoint_ids
            }
        },
        select: {
            name: true
        }
    }).then(r => r.map(e => e.name as string))

    const data = await Promise.all(periods.map(async period => {
        let stat = await DB.endpoints_entities.findMany({
            where: {
                id: {
                    in: endpoint_ids
                },
                usage_log_entities: {
                    some: {
                        status: {
                            notIn: success_status_code_range
                        },
                        timestamp: {
                            lte: period.endDate,
                            gte: period.startDate
                        }
                    }
                }
            },
            select: {
                name: true,
                _count: {
                    select: {
                        usage_log_entities: true
                    }
                }
            }
        })
        const r = stat.map(s => {
            return ({ [s.name as string]: s._count.usage_log_entities ?? 0 })
        })
        return r
    }))

    console.log({ data })

    const results = data.map(
        (d, i) => d.reduce((a, b) => ({ ...a, ...b, name: periods[i].name }),
            { name: periods[i].name, ...endpointNames.reduce((a, b) => ({ ...a, [b]: 0 }), {}) })
    )

    return results
}