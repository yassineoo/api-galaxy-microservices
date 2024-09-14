import dotenv from "dotenv";
import Stripe from "stripe";
import { priceModel } from "../models/stripe/prices.mjs";
import { updateApiEntity, updatePlanEntity } from "../models/local-db/extra.mjs";

dotenv.config();

const stripeObject = Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2020-08-27",
});

export const getCustomerTransactionHistory = async (req, res) => {
  const customerId = req.body.customerId;
  try {
    const charges = await stripeObject.charges.list({
      customer: customerId,
      limit: 100,
    });
    return charges.data;
  } catch (error) {
    console.error("Error retrieving charges:", error);
    return [];
  }
};

export const createPrice = async (req, res) => {
  console.log(req.body)
  try {
    let { planEntityId, stripeApiId, pricenumber } = req.body;
    const price = await priceModel.createPrice(stripeApiId, pricenumber);
    console.log(price);
    const updatedPrice = await updatePlanEntity(planEntityId, { stripe_price_id: price.id });
    console.log(updatedPrice);
    res.status(200).send("Price created successfully");
  } catch (error) {
    console.error("Error creating price:", error);
    res.status(500).send("Failed to create price");
  }
};

export const getPrices = async (req, res) => {
  const prices = await priceModel.getPricesOfProductId(req.params.productId);
  res.send(prices);
};
