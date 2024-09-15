import express from 'express';
import path from 'path'
import { chargeController, checkoutSession, config, createAndFinalizeInvoiceHandler, createCheckoutSession, createCheckoutSessionForProvider, createCheckoutSessionWithCommission, customerPortal, getSessionHanlder, webhook } from '../controllers/stripeController.mjs';
const stripeRouter = express.Router();



// Fetch the Checkout Session to display the JSON result on the success page
stripeRouter.get("/checkout-session", checkoutSession);
stripeRouter.get("/config",config);


stripeRouter.post("/create-checkout-session",createCheckoutSession);
stripeRouter.post("/create-checkout-session-commission",createCheckoutSessionForProvider);
stripeRouter.post('/customer-portal',customerPortal );

stripeRouter.post("/get-invoice",createAndFinalizeInvoiceHandler);
stripeRouter.get("/get-session/:sessionId",getSessionHanlder);

stripeRouter.post("/charge",chargeController);

// Webhook handler for asynchronous events.
stripeRouter.post("/webhook", webhook);

export default stripeRouter;