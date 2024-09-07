import express from 'express';
import {
  createSubscriptionHandler,
  getSubscriptionsHandler,
  updateSubscriptionHandler,
  deleteSubscriptionHandler,
  createPlanHandler,
  getPlansHandler,
  updatePlanHandler,
  deletePlanHandler,
  createObjectPlanHandler,
  getObjectPlansHandler,
  updateObjectPlanHandler,
  deleteObjectPlanHandler,
  getUserSubscriptionsHandler,

} from '../controllers/subscriptionController.mjs';

const subscriptionRouter = express.Router();

// Subscription routes
subscriptionRouter.post('/subscriptions', createSubscriptionHandler);
subscriptionRouter.get('/subscriptions', getSubscriptionsHandler);
subscriptionRouter.get('/subscriptions/:userId', getUserSubscriptionsHandler);
// subscriptionRouter.get('/providers/:providerId', getAllSubscribersForProviderHandler);

subscriptionRouter.put('/subscriptions/:id', updateSubscriptionHandler);
subscriptionRouter.delete('/subscriptions/:id', deleteSubscriptionHandler);

// Plan routes
subscriptionRouter.post('/plans', createPlanHandler);
subscriptionRouter.get('/plans', getPlansHandler);
subscriptionRouter.put('/plans/:id', updatePlanHandler);
subscriptionRouter.delete('/plans/:id', deletePlanHandler);

// Object Plan routes
subscriptionRouter.post('/object-plans', createObjectPlanHandler);
subscriptionRouter.get('/object-plans', getObjectPlansHandler);
subscriptionRouter.put('/object-plans/:id', updateObjectPlanHandler);
subscriptionRouter.delete('/object-plans/:id', deleteObjectPlanHandler);

export default subscriptionRouter;
