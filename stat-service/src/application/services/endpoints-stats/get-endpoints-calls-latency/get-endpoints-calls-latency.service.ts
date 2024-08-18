import { Duration, ID } from "../../../../contracts/endpoint-stats/_common";
import { success_status_code_range } from "../../../../infrastructure/api/http";
import { DB } from "../../../../infrastructure/database";
import { getTimePeriods } from "../../_common/get-time-periods";

export default async function get_endpoints_calls_latency_service(duration: Duration, endpoint_ids: ID[]) {

    const periods = getTimePeriods(duration)
    console.log({ periods })

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
                        timestamp: {
                            lte: period.endDate,
                            gte: period.startDate
                        }
                    }
                }
            },
            select: {
                name: true,
                usage_log_entities: {
                    select: {
                        response_time: true
                    }
                }
            },
            take: 2
        })
        const logs = stat.map(s => ({
            name: period.name,
            [s.name as string]: (s.usage_log_entities
                .map(l => Number(l.response_time ?? 0))
                .reduce((a, b) => a + b, 0)) / s.usage_log_entities.length
        }))
        return logs
    }))
    const prettyData = data
        .map((d, i) =>
            d.reduce(
                (a, b) => ({ ...a, ...b, name: periods[i].name }),
                { name: periods[i].name, ...endpointNames.reduce((a, b) => ({ ...a, [b]: 0 }), {}) }
            )
        )

    return prettyData
}