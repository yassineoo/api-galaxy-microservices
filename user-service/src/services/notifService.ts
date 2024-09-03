import { prismaClientSingleton } from "../utils/prisma";

async function getUserNotifications(userId: number) {
  let notifications =
    await prismaClientSingleton.notification_entities.findMany({
      where: {
        recipient_id: userId,
      },
    });
  console.log("notifications listss", userId, notifications);

  const finalNotifications = JSON.stringify(notifications, (key, value) =>
    typeof value == "bigint" ? value.toString() : value
  );
  console.log("notifications listss", finalNotifications);

  return JSON.parse(finalNotifications);
}

export const notificationsService = {
  getUserNotifications,
};
