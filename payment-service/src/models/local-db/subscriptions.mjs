import prisma from "./prisma.mjs"


function convertBigIntToString(obj) {
  if (typeof obj !== "object" || obj === null) return obj;

  for (const key in obj) {
    if (typeof obj[key] === "bigint") {
      obj[key] = obj[key].toString();
    } else if (typeof obj[key] === "object") {
      convertBigIntToString(obj[key]); // Recursively handle nested objects
    }
  }
  return obj;
}

// CRUD Operations for Subscription

// Create a Subscription
async function createSubscription(data) {
  try {
    const newSubscription = await prisma.subscription_entities.create({
      data,
    });
    return convertBigIntToString(newSubscription); // Convert BigInt before returning
  } catch (error) {
    throw new Error(`Failed to create subscription: ${error.message}`);
  }
}

// Read Subscriptions
async function getSubscriptions() {
  try {
    const subscriptions = await prisma.subscription_entities.findMany({
      include: {
        plan_entities: true, // Includes related plan details
        usage_log_entities: true, // Includes usage logs
      },
    });
    return subscriptions.map(convertBigIntToString); // Convert BigInt in each item
  } catch (error) {
    throw new Error(`Failed to fetch subscriptions: ${error.message}`);
  }
}

async function getUserSubscriptions(userId) {
  try {
    const subscriptions = await prisma.subscription_entities.findMany({
      where: { user_id: userId },
      include: {
        plan_entities: true, // Includes related plan details
        usage_log_entities: true, // Includes usage logs
      },
    });
    return subscriptions.map(convertBigIntToString); // Convert BigInt in each item
  } catch (error) {
    throw new Error(`Failed to fetch subscriptions: ${error.message}`);
  }
}

// Update a Subscription
async function updateSubscription(id, data) {
  try {
    const updatedSubscription = await prisma.subscription_entities.update({
      where: { id },
      data,
    });
    return convertBigIntToString(updatedSubscription); // Convert BigInt before returning
  } catch (error) {
    throw new Error(`Failed to update subscription: ${error.message}`);
  }
}

// Delete a Subscription
async function deleteSubscription(id) {
  try {
    const deletedSubscription = await prisma.subscription_entities.delete({
      where: { id },
    });
    return convertBigIntToString(deletedSubscription); // Convert BigInt before returning
  } catch (error) {
    throw new Error(`Failed to delete subscription: ${error.message}`);
  }
}

// CRUD Operations for Plan

// Create a Plan
async function createPlan(data) {
  try {
    const newPlan = await prisma.plan_entities.create({
      data,
    });
    return convertBigIntToString(newPlan); // Convert BigInt before returning
  } catch (error) {
    throw new Error(`Failed to create plan: ${error.message}`);
  }
}

// Read Plans
async function getPlans() {
  try {
    const plans = await prisma.plan_entities.findMany({
      include: {
        subscription_entities: true, // Includes related subscriptions
      },
    });
    return plans.map(convertBigIntToString); // Convert BigInt in each item
  } catch (error) {
    throw new Error(`Failed to fetch plans: ${error.message}`);
  }
}


// Update a Plan
async function updatePlan(id, data) {
  try {
    const updatedPlan = await prisma.plan_entities.update({
      where: { id },
      data,
    });
    return convertBigIntToString(updatedPlan); // Convert BigInt before returning
  } catch (error) {
    throw new Error(`Failed to update plan: ${error.message}`);
  }
}

// Delete a Plan
async function deletePlan(id) {
  try {
    const deletedPlan = await prisma.plan_entities.delete({
      where: { id },
    });
    return convertBigIntToString(deletedPlan); // Convert BigInt before returning
  } catch (error) {
    throw new Error(`Failed to delete plan: ${error.message}`);
  }
}

// CRUD Operations for Object Plan

// Create an Object Plan
async function createObjectPlan(data) {
  try {
    const newObjectPlan = await prisma.object_plan_entities.create({
      data,
    });
    return convertBigIntToString(newObjectPlan); // Convert BigInt before returning
  } catch (error) {
    throw new Error(`Failed to create object plan: ${error.message}`);
  }
}

// Read Object Plans
async function getObjectPlans() {
  try {
    const objectPlans = await prisma.object_plan_entities.findMany({
      include: {
        cross_object_entities: true,
        endpoint_object_entities: true,
      },
    });
    return objectPlans.map(convertBigIntToString); // Convert BigInt in each item
  } catch (error) {
    throw new Error(`Failed to fetch object plans: ${error.message}`);
  }
}

// Update an Object Plan
async function updateObjectPlan(id, data) {
  try {
    const updatedObjectPlan = await prisma.object_plan_entities.update({
      where: { id },
      data,
    });
    return convertBigIntToString(updatedObjectPlan); // Convert BigInt before returning
  } catch (error) {
    throw new Error(`Failed to update object plan: ${error.message}`);
  }
}

// Delete an Object Plan
async function deleteObjectPlan(id) {
  try {
    const deletedObjectPlan = await prisma.object_plan_entities.delete({
      where: { id },
    });
    return convertBigIntToString(deletedObjectPlan); // Convert BigInt before returning
  } catch (error) {
    throw new Error(`Failed to delete object plan: ${error.message}`);
  }
}

await prisma.$disconnect();


// async function getAllSubscribersForProvider(providerUserId) {
//   const subscribers = await prisma.$queryRaw`SELECT * FROM `

//   return subscribers;
// };

// Exporting functions
export {
  createSubscription,
  getSubscriptions,
  getUserSubscriptions,
  updateSubscription,
  deleteSubscription,
  createPlan,
  getPlans,
  updatePlan,
  deletePlan,
  createObjectPlan,
  getObjectPlans,
  updateObjectPlan,
  deleteObjectPlan
};
