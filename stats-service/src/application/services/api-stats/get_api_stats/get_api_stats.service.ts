import { Decimal } from "@prisma/client/runtime/library";
import { Duration, ID } from "../../../../contracts/endpoint-stats/_common";
import { success_status_code_range } from "../../../../infrastructure/api/http";
import { DB } from "../../../../infrastructure/database";
import { getTimePeriods, Period } from "../../_common/get-time-periods";

export default async function get_apis_stats_service(
  api_ids: ID[],
  duration: Duration,
  userId: ID
) {
  const periods = getTimePeriods(duration);
  // console.log("stat-debug 1 ", { periods });

  const results = await Promise.all(
    periods.map((period) => get_apis_stats_in_period(period, api_ids, userId))
  );
  // console.log("stat-debug 2 ", { results });

  return results;
}

async function get_apis_stats_in_period(
  period: Period,
  api_ids: ID[],
  userId: ID
) {
  const results = await Promise.all(
    api_ids.map(async (api_id) => {
      console.log("stat-debug sub 1 ", { period, api_id });

      const [success, error, latency] = await Promise.all([
        get_api_success_calls_in_period(period, api_id, userId),
        get_api_error_calls_in_period(period, api_id, userId),
        get_api_calls_latency_in_period(period, api_id, userId),
      ]);
      return {
        name: period.name,
        [api_id.toString()]: {
          Calls: success,
          Errors: error,
          Latency: latency,
        },
      };
    })
  );

  const prettyStats = results.reduce((acc, curr) => ({ ...acc, ...curr }), {});
  // console.log("stat-debug sub 2 ", { period });

  //console.log({ prettyStats });

  return prettyStats;
}

async function get_api_success_calls_in_period(
  period: Period,
  api_id: ID,
  userId: ID
) {
  try {
    //  console.log("Fetching success calls", { period, api_id, userId });
    const success = await DB.usage_log_entities.aggregate({
      where: {
        endpoints_entities: {
          endpoints_group_entities: {
            api_id,
            api_entities: {
              user_entities: {
                id: userId,
              },
            },
          },
        },

        timestamp: {
          lte: period.endDate,
          gte: period.startDate,
        },
      },
      _count: true,
    });
    //  console.log("Success query result", { success });
    return success._count ?? 0;
  } catch (error) {
    console.error("Error fetching success calls", { error });
    return 0;
  }
}

async function get_api_error_calls_in_period(
  period: Period,
  api_id: ID,
  userId: ID
) {
  try {
    //  console.log("Fetching error calls", { period, api_id, userId });
    const errors = await DB.usage_log_entities.aggregate({
      where: {
        endpoints_entities: {
          endpoints_group_entities: {
            api_id,
            api_entities: {
              user_entities: {
                id: userId,
              },
            },
          },
        },
        status: {
          notIn: success_status_code_range,
        },
        timestamp: {
          lte: period.endDate,
          gte: period.startDate,
        },
      },
      _count: true,
    });
    //  console.log("Error query result", { errors });
    return errors._count ?? 0;
  } catch (error) {
    //  console.error("Error fetching error calls", { error });
    return 0;
  }
}

async function get_api_calls_latency_in_period(
  period: Period,
  api_id: ID,
  userId: ID
) {
  try {
    // console.log("Fetching latency", { period, api_id, userId });
    const latency = await DB.usage_log_entities.aggregate({
      where: {
        endpoints_entities: {
          endpoints_group_entities: {
            api_id,
            api_entities: {
              user_entities: {
                id: userId,
              },
            },
          },
        },

        timestamp: {
          lte: period.endDate,
          gte: period.startDate,
        },
      },
      _avg: {
        response_time: true,
      },
    });
    //  console.log("Latency query result", { latency });
    return latency._avg.response_time ?? 0;
  } catch (error) {
    // console.error("Error fetching latency", { error });
    return 0;
  }
}
