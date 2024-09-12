import { Decimal } from "@prisma/client/runtime/library";
import { DB } from "../../../../infrastructure/database";

export default async function get_apis_stats_service_donut(
  apiIds: bigint[]
): Promise<{ apiId: bigint; totalAmount: number | Decimal }[]> {
  const results: { apiId: bigint; totalAmount: number }[] = [];

  for (const apiId of apiIds) {
    const totalAmount = await DB.transaction_entities.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        invoice_entities: {
          subscription_entities: {
            plan_entities: {
              api_id: apiId,
            },
          },
        },
      },
    });

    results.push({
      apiId,
      totalAmount: Number(totalAmount._sum.amount) || 0,
    });
  }
  const jsonString = JSON.stringify(results, (key, value) =>
    typeof value == "bigint" ? value.toString() : value
  );

  return JSON.parse(jsonString);
}
