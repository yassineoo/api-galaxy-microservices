import { prismaClientSingleton } from "../utils/prisma";

async function getUserNotifications(userId: number) {
  let notifications =
    await prismaClientSingleton.notification_entities.findMany({
      where: {
        recipient_id: userId,
      },
      orderBy: {
        created_at: "desc", // Sort by 'created_at' in descending order (latest first)
      },
    });

  const finalNotifications = JSON.stringify(notifications, (key, value) =>
    typeof value == "bigint" ? value.toString() : value
  );

  return JSON.parse(finalNotifications);
}

async function getStatBox(userId: number, type: string) {
  if (type === "customer") {
    // Number of calls from logs table for the user
    const callCount = await prismaClientSingleton.usage_log_entities.count({
      where: {
        subscription_entities: {
          user_id: userId,
        },
      },
    });

    // Amount of money spent by the user in the transactions table
    const totalSpent =
      await prismaClientSingleton.subscription_entities.aggregate({
        where: {
          user_id: userId,
        },
        _sum: {
          used_calls: true,
        },
      });

    // Number of APIs subscribed by the user
    const subscribedApis =
      await prismaClientSingleton.subscription_entities.count({
        where: {
          user_id: userId,
        },
      });

    // Number of APIs liked by the user
    const likedApis = await prismaClientSingleton.like_entities.count({
      where: {
        user_id: userId,
      },
    });

    const res = {
      callCount,
      totalSpent: totalSpent._sum?.used_calls ?? 0,
      subscribedApis,
      likedApis,
    };

    const finalRes = JSON.stringify(res, (key, value) =>
      typeof value == "bigint" ? value.toString() : value
    );

    return JSON.parse(finalRes);
  }

  if (type === "provider") {
    // Number of calls for all APIs owned by the provider
    const callCount = await prismaClientSingleton.usage_log_entities.count({
      where: {
        endpoints_entities: {
          endpoints_group_entities: {
            api_entities: {
              provider_id: userId,
            },
          },
        },
      },
    });

    // Amount of money earned by the provider (through transactions)
    const totalEarned = await prismaClientSingleton.invoice_entities.aggregate({
      where: {
        subscription_entities: {
          plan_entities: {
            api_entities: {
              provider_id: userId,
            },
          },
        },
      },
      _sum: {
        total_amount: true,
      },
    });

    // Number of APIs provided by the provider
    const providedApis = await prismaClientSingleton.api_entities.count({
      where: {
        provider_id: userId,
      },
    });

    // Number of subscribers to the provider's APIs
    const subscriberCount =
      await prismaClientSingleton.subscription_entities.count({
        where: {
          plan_entities: {
            api_entities: {
              provider_id: userId,
            },
          },
        },
      });

    const res = {
      callCount,
      totalEarned: totalEarned._sum?.total_amount ?? 0,
      providedApis,
      subscriberCount,
    };

    const finalRes = JSON.stringify(res, (key, value) =>
      typeof value == "bigint" ? value.toString() : value
    );

    return JSON.parse(finalRes);
  }

  if (type === "admin") {
    // Number of calls from logs for all APIs
    const callCount = await prismaClientSingleton.usage_log_entities.count();

    // Amount of money earned (all transactions)
    const totalEarned =
      await prismaClientSingleton.transaction_entities.aggregate({
        _sum: {
          amount: true,
        },
      });

    // Number of APIs provided
    const providedApis = await prismaClientSingleton.api_entities.count();

    // Number of users
    const userCount = await prismaClientSingleton.user_entities.count();

    const res = {
      callCount,
      totalEarned: totalEarned._sum?.amount ?? 0,
      providedApis,
      userCount,
    };

    const finalRes = JSON.stringify(res, (key, value) =>
      typeof value == "bigint" ? value.toString() : value
    );

    return JSON.parse(finalRes);
  }

  throw new Error("Invalid user type provided");
}

export const notificationsService = {
  getUserNotifications,
  getStatBox,
};
