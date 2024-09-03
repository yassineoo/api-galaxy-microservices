import cron from "node-cron";
import { prismaClientSingleton } from "./prisma";
import dayJs from "dayjs";
export const updateEarningPercentage = async (
  earningPercentage: number,
  adminId: number
) => {
  try {
    const lastSetting = await prismaClientSingleton.settings_entities.findFirst(
      {
        orderBy: {
          updated_at: "desc",
        },
      }
    );

    await prismaClientSingleton.settings_entities.create({
      data: {
        earning_percentage: earningPercentage,
        termsAndConditions: lastSetting?.termsAndConditions,
        privacyAndPolicy: lastSetting?.privacyAndPolicy,
        user_entities: {
          connect: {
            id: adminId,
          },
        },
      },
    });
    return true;
  } catch (error) {
    throw error;
  }
};

export const scheduelEarningPercentage = async (
  earning_percentage: number,
  adminId: number
) => {
  try {
    // calculate the exacte time after 7 days
    const after7daysFromNow = dayJs().add(5, "minute");

    // create a cron expression for that
    const cronExpression = `${after7daysFromNow.second()} ${after7daysFromNow.minute()} ${after7daysFromNow.hour()} ${after7daysFromNow.date()} ${
      after7daysFromNow.month() + 1
    } *`;
    cron.schedule(
      cronExpression,
      async () => {
        await updateEarningPercentage(earning_percentage, adminId);
      },
      {
        scheduled: true,
      }
    );
  } catch (error: any) {
    console.log("error from schedule", error.message);
    throw error;
  }
};
