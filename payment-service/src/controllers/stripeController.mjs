import dotenv from "dotenv";
import stripeTypes from "../validation/stripeTypes.mjs";
import Stripe from "stripe";
import { createAndFinalizeInvoice, getSession } from "../models/stripe/invoice.mjs";
import { accountModel } from "../models/stripe/accounts.mjs";
import {
  createInvoice,
  createTransaction,
} from "../models/local-db/transactions.mjs";
import { createSubscription } from "../models/local-db/subscriptions.mjs";
import { chargeClientForApiCall } from "../models/stripe/charge.mjs";

dotenv.config();

const stripeObject = Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2020-08-27",
});

const now = new Date();
const nextMonth = new Date(now);
nextMonth.setMonth(now.getMonth() + 1);

// Format dates as ISO strings (optional, Prisma handles Date objects directly)
const todayDate = now.toISOString(); // Example: "2024-09-03T12:34:56.789Z"
const nextMonthDate = nextMonth.toISOString(); // Example: "2024-10-03T12:34:56.789Z"

export const checkoutSession = async (req, res) => {
  const { sessionId } = req.query;
  const session = await stripeObject.checkout.sessions.retrieve(sessionId);
  res.send(session);
};

export const createCheckoutSession = async (req, res) => {
  const domainURL = process.env.DOMAIN;
  console.log(req.body);
  const { error } = stripeTypes.createCheckoutSession.validate(
    req.body.stripeRequest
  );
  if (error) {
    console.error(`Validation error: ${error.message}`);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  // Create new Checkout Session for the order
  // Other optional params include:
  // [billing_address_collection] - to display billing address details on the page
  // [customer] - if you have an existing Stripe Customer ID
  // [customer_email] - lets you prefill the email input in the form
  // [automatic_tax] - to automatically calculate sales tax, VAT and GST in the checkout page
  // For full details see https://stripe.com/docs/api/checkout/sessions/create
  try {
    const session = await stripeObject.checkout.sessions.create({
      payment_method_types: [req.body.paymentMethod],
      mode: "subscription",
      customer_email: req.body?.customerEmail,
      customer: req.body?.customerId,
      line_items: [
        {
          price: req.body.priceId,
          quantity: 1,
        },
      ],

      // ?session_id={CHECKOUT_SESSION_ID} means the redirect will have the session ID set as a query param
      success_url: `${domainURL}/${req.body.success_url}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${domainURL}/${req.body.cancel_url}`,
      // automatic_tax: { enabled: true }
    });

    const subscription = await createSubscription({
      user_id: req.body.userId,
      plan_id: req.body.planId,
      start_date: todayDate,
      end_date: nextMonthDate,
      status: "active",
    });
    console.log("subscription created", subscription);

    const invoice = await createInvoice({
      subscription_id: subscription.id,
      total_amount: req.body.amount,
      status: "Paid",
      date_issued: todayDate,
      due_date: nextMonthDate,
    });
    const transaction = await createTransaction({
      amount: req.body.amount,
      transaction_date: todayDate,
      invoice_id: Number(invoice.id),
      payment_method_id: req.body.paymentMethod === "card" ? 1 : 2,
      status: "Paid",
    });
    return res.json({
      url: session.url
    });
  } catch (e) {
    res.status(400);
    console.log(e);
    return res.send({
      error: {
        message: e.message,
      },
    });
  }
};

export const createCheckoutSessionForProvider = async (req, res) => {
  const domainURL = process.env.DOMAIN;
  const platformFeePercentage = 0.15;

  console.log(req.body);
  const { error } = stripeTypes.createCheckoutSession.validate(
    req.body.stripeRequest
  );
  if (error) {
    console.error(`Validation error: ${error.message}`);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  try {
    const session = await stripeObject.checkout.sessions.create({
      payment_method_types: [req.body.paymentMethod],
      mode: "subscription",
      customer_email: req.body?.customerEmail,
      customer: req.body?.customerId,
      line_items: [
        {
          price: req.body.priceId,
          quantity: 1,
        },
      ],
      subscription_data: {
        transfer_data: {
          destination: "cus_QmcLiYqrV73tJx",
        },
        application_fee_percent: platformFeePercentage * 100,
      },
      success_url: `${domainURL}/${req.body.success_url}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${domainURL}/${req.body.cancel_url}`,
    });

    const subscription = await createSubscription({
      user_id: req.body.userId,
      plan_id: req.body.planId,
      start_date: todayDate,
      end_date: nextMonthDate,
      status: "active",
    });
    console.log("subscription created", subscription);

    const invoice = await createInvoice({
      subscription_id: subscription.id,
      total_amount: req.body.amount,
      status: "Paid",
      date_issued: todayDate,
      due_date: nextMonthDate,
    });

    const transaction = await createTransaction({
      amount: req.body.amount,
      transaction_date: todayDate,
      invoice_id: Number(invoice.id),
      payment_method_id: req.body.paymentMethod === "card" ? 1 : 2,
      status: "Paid",
    });

    return res.json({ url: session.url });
  } catch (e) {
    res.status(400);
    console.log(e);
    return res.send({
      error: {
        message: e.message,
      },
    });
  }
};

export const chargeController = async (req, res) => {
  const { customerId, amount } = req.body;
  try {

    const paymentIntent = await chargeClientForApiCall(customerId, amount);


    res.status(200).json({ success: true, paymentIntent });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}


export const createCheckoutSessionWithCommission = async (req, res) => {
  const domainURL = process.env.DOMAIN;
  console.log(req.body);

  const { error } = stripeTypes.createCheckoutSession.validate(req.body.stripeRequest);
  if (error) {
    console.error(`Validation error: ${error.message}`);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  try {
    // Step 1: Create a Payment Intent (instead of a Checkout Session)
    const paymentIntent = await stripeObject.paymentIntents.create({
      amount: req.body.amount, // Amount in cents (e.g., 10000 for $100.00)
      currency: "usd", // Change this if necessary (e.g., 'eur' for IBAN payments)
      payment_method_types: [req.body.paymentMethod], // e.g., ['card']
      customer_email: req.body?.customerEmail, // Optionally link a customer email
      transfer_data: {
        destination: req.body.providerAccountId, // The connected provider's account ID
      },
      application_fee_amount: Math.floor(req.body.amount * 0.15), // Your 15% platform fee
      description: "API Marketplace Subscription",
    });

    // Step 2: Create Subscription and Invoice records in your database (as before)
    const subscription = await createSubscription({
      user_id: req.body.userId,
      plan_id: req.body.planId,
      start_date: todayDate,
      end_date: nextMonthDate,
      status: "active",
    });
    console.log("subscription created", subscription);

    const invoice = await createInvoice({
      subscription_id: subscription.id,
      total_amount: req.body.amount,
      status: "Paid",
      date_issued: todayDate,
      due_date: nextMonthDate,
    });

    const transaction = await createTransaction({
      amount: req.body.amount,
      transaction_date: todayDate,
      invoice_id: Number(invoice.id),
      payment_method_id: req.body.paymentMethod === "card" ? 1 : 2,
      status: "Paid",
    });

    // Step 3: Redirect to success URL with PaymentIntent details (optional)
    const successUrl = `${domainURL}/${req.body.success_url}?payment_intent=${paymentIntent.id}`;
    return res.json({ url: successUrl });
  } catch (e) {
    res.status(400);
    console.log(e);
    return res.send({
      error: {
        message: e.message,
      },
    });
  }
};

export const config = (req, res) => {
  res.send({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    basicPrice: process.env.BASIC_PRICE_ID,
    proPrice: process.env.PRO_PRICE_ID,
  });
};

export const customerPortal = async (req, res) => {
  // For demonstration purposes, we're using the Checkout session to retrieve the customer ID.
  // Typically this is stored alongside the authenticated user in your database.
  const { sessionId } = req.body;
  const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);

  // This is the url to which the customer will be redirected when they are done
  // managing their billing with the portal.
  const returnUrl = process.env.DOMAIN;

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: checkoutSession.customer,
    return_url: returnUrl,
  });

  res.redirect(303, portalSession.url);
};

export const webhook = async (req, res) => {
  let data;
  let eventType;
  // Check if webhook signing is configured.
  if (process.env.STRIPE_WEBHOOK_SECRET) {
    // Retrieve the event by verifying the signature using the raw body and secret.
    let event;
    let signature = req.headers["stripe-signature"];

    try {
      event = stripeObject.webhooks.constructEvent(
        req.rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`);
      return res.sendStatus(400);
    }
    // Extract the object from the event.
    data = event.data;
    eventType = event.type;
  } else {
    // Webhook signing is recommended, but if the secret is not configured in `config.js`,
    // retrieve the event data directly from the request body.
    data = req.body.data;
    eventType = req.body.type;
  }

  if (eventType === "checkout.session.completed") {
    console.log(`🔔  Payment received!`);
  }

  res.sendStatus(200);
};

export const createAndFinalizeInvoiceHandler = async (req, res) => {
  try {
    const { email, amount } = req.body
    console.log("body ", req.body)
    const invoiceLink = await createAndFinalizeInvoice(email,amount);
    res.status(200).send({ invoiceLink });
  } catch (error) {
    res
      .status(500)
      .send(`Failed to create and finalize invoice: ${error.message}`);
  }
};

export const getSessionHanlder  = async (req, res) => {
  const { sessionId } = req.params;
  try {
    const session = await getSession(sessionId);
    res.status(200).json({ session });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}