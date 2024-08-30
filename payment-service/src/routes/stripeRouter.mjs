import express from 'express';
import path from 'path'
import { checkoutSession, config, createCheckoutSession, customerPortal, webhook } from '../controllers/stripeController.mjs';
const stripeRouter = express.Router();



// Fetch the Checkout Session to display the JSON result on the success page
stripeRouter.get("/checkout-session", checkoutSession);
stripeRouter.get("/config",config);


stripeRouter.post("/create-checkout-session",createCheckoutSession);
stripeRouter.post('/customer-portal',customerPortal );

// Webhook handler for asynchronous events.
stripeRouter.post("/webhook", webhook);

export default stripeRouter;