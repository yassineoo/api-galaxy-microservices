import { priceModel } from "../models/stripe/prices.mjs";
import { productModel } from "../models/stripe/products.mjs";
import dotenv from "dotenv";
import Stripe from "stripe";

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
  let { name, description, pricenumber } = req.body;
  productModel.createProductWithPrice(name, description, pricenumber);
};

export const getPrices = async (req, res) => {
  const prices = await priceModel.getPricesOfProductId(req.params.productId);
  res.send(prices);
};
