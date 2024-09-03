import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function updatePlan(planId, updatedData) {
  try {
    // Update the plan based on the provided planId and updatedData
    const updatedPlan = await prisma.plan_entities.update({
      where: { id: BigInt(planId) },
      data: updatedData,
    });

    console.log("Plan updated successfully:", updatedPlan);
    return updatedPlan;
  } catch (error) {
    console.error("Error updating plan:", error);
    throw error;
  }
}

export async function updateApiEntity(apiEntityId, updatedData) {
  try {
    // Update the API entity based on the provided apiEntityId and updatedData
    const updatedApiEntity = await prisma.api_entities.update({
      where: { id: BigInt(apiEntityId) },
      data: updatedData,
    });

    console.log("API entity updated successfully:", updatedApiEntity);
    return updatedApiEntity;
  } catch (error) {
    console.error("Error updating API entity:", error);
    throw error;
  }
}
