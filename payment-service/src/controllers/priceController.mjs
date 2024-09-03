import { priceModel } from "../models/stripe/prices.mjs";
import { productModel } from "../models/stripe/products.mjs";
import dotenv from "dotenv";
import Stripe from "stripe";
import axios from "axios";
import { updatePlan } from "../models/local-db/extra.mjs";

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
  const { productId, priceNumber, planId } = req.body;
  try {
    const price = await priceModel.createPrice(
      productId,
      (Number(priceNumber) * 100).toString()
    );
    res.status(200).send(price);
    //add priceID to entity
    const updatedPlan = await updatePlan(planId, {
      stripe_price_id: price.id,
    });
  } catch (error) {
    console.error("Error creating price:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const createPriceOfproduct = async (req, res) => {
  let { name, description, pricenumber } = req.body;
  productModel.createProductWithPrice(name, description, pricenumber);
};

export const getPrices = async (req, res) => {
  const prices = await priceModel.getPricesOfProductId(req.params.productId);
  res.send(prices);
};
