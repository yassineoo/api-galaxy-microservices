import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function updatePlanEntity(planEntityId, updateData) {
  try {
    const updatedPlanEntity = await prisma.plan_entities.update({
      where: { id: planEntityId },
      data: updateData,
    });
    return updatedPlanEntity;
  } catch (error) {
    console.error("Error updating Plan entity:", error);
    throw error;
  }
}

export async function updateApiEntity(apiEntityId, updateData) {
  try {
    const updatedApiEntity = await prisma.api_entities.update({
      where: { id: Number(apiEntityId) },
      data: updateData,
    });
    return updatedApiEntity;
  } catch (error) {
    console.error("Error updating API entity:", error);
    throw error;
  }
}
