import {
  createSubscription,
  getSubscriptions,
  updateSubscription,
  deleteSubscription,
  createPlan,
  getPlans,
  updatePlan,
  deletePlan,
  createObjectPlan,
  getObjectPlans,
  updateObjectPlan,
  deleteObjectPlan,
  getUserSubscriptions,
} from "../models/local-db/subscriptions.mjs";

// Controller for creating a subscription
export async function createSubscriptionHandler(req, res) {
  try {
    const subscriptionData = req.body;
    const newSubscription = await createSubscription(subscriptionData);
    res.status(201).json(newSubscription);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Failed to create subscription: ${error.message}` });
  }
}

// Controller for getting all subscriptions
export async function getSubscriptionsHandler(req, res) {
  try {
    const subscriptions = await getSubscriptions();
    res.status(200).json(subscriptions);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Failed to fetch subscriptions: ${error.message}` });
  }
}

// Controller for updating a subscription
export async function updateSubscriptionHandler(req, res) {
  try {
    const { id } = req.params;
    const subscriptionData = req.body;
    const updatedSubscription = await updateSubscription(
      BigInt(id),
      subscriptionData
    );
    res.status(200).json(updatedSubscription);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Failed to update subscription: ${error.message}` });
  }
}

// Controller for deleting a subscription
export async function deleteSubscriptionHandler(req, res) {
  try {
    const { id } = req.params;
    await deleteSubscription(BigInt(id));
    res.status(204).send();
  } catch (error) {
    res
      .status(500)
      .json({ error: `Failed to delete subscription: ${error.message}` });
  }
}

// Controller for creating a plan
export async function createPlanHandler(req, res) {
  try {
    const planData = req.body;
    const newPlan = await createPlan(planData);
    res.status(201).json(newPlan);
  } catch (error) {
    res.status(500).json({ error: `Failed to create plan: ${error.message}` });
  }
}

// Controller for getting all plans
export async function getPlansHandler(req, res) {
  try {
    const plans = await getPlans();
    res.status(200).json(plans);
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch plans: ${error.message}` });
  }
}

// Controller for updating a plan
export async function updatePlanHandler(req, res) {
  try {
    const { id } = req.params;
    const planData = req.body;
    const updatedPlan = await updatePlan(BigInt(id), planData);
    res.status(200).json(updatedPlan);
  } catch (error) {
    res.status(500).json({ error: `Failed to update plan: ${error.message}` });
  }
}

// Controller for deleting a plan
export async function deletePlanHandler(req, res) {
  try {
    const { id } = req.params;
    await deletePlan(BigInt(id));
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: `Failed to delete plan: ${error.message}` });
  }
}

// Controller for creating an object plan
export async function createObjectPlanHandler(req, res) {
  try {
    const objectPlanData = req.body;
    const newObjectPlan = await createObjectPlan(objectPlanData);
    res.status(201).json(newObjectPlan);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Failed to create object plan: ${error.message}` });
  }
}

// Controller for getting all object plans
export async function getObjectPlansHandler(req, res) {
  try {
    const objectPlans = await getObjectPlans();
    res.status(200).json(objectPlans);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Failed to fetch object plans: ${error.message}` });
  }
}

// Controller for updating an object plan
export async function updateObjectPlanHandler(req, res) {
  try {
    const { id } = req.params;
    const objectPlanData = req.body;
    const updatedObjectPlan = await updateObjectPlan(
      BigInt(id),
      objectPlanData
    );
    res.status(200).json(updatedObjectPlan);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Failed to update object plan: ${error.message}` });
  }
}

// Controller for deleting an object plan
export async function deleteObjectPlanHandler(req, res) {
  try {
    const { id } = req.params;
    await deleteObjectPlan(BigInt(id));
    res.status(204).send();
  } catch (error) {
    res
      .status(500)
      .json({ error: `Failed to delete object plan: ${error.message}` });
  }
}

export async function getUserSubscriptionsHandler(req, res) {
  try {
    const { userId } = req.params;
    console.log(BigInt(userId));
    const subscriptions = await getUserSubscriptions(BigInt(userId));
    console.log(subscriptions);
    res.status(200).json(subscriptions);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Failed to fetch user subscriptions: ${error.message}` });
  }
}


// export async function getAllSubscribersForProviderHandler(req, res) {
//   try {
//     const providerId = Number(req.params.providerId); // Get providerId from request parameters

//     // Call the service function to get all subscribers
//     const subscribers = await getAllSubscribersForProvider(providerId)

//     // Respond with the subscribers data
//     res.status(200).json(subscribers);
//   } catch (error) {
//     console.error(`Error fetching subscribers for provider: ${error.message}`);
//     res.status(500).json({ error: 'Failed to fetch subscribers for provider.' });
//   }
// }