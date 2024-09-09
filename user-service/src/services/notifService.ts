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

export const notificationsService = {
  getUserNotifications,
};
