import dotenv from "dotenv";
dotenv.config();

import stripe from 'stripe';
const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);
export default stripeInstance;