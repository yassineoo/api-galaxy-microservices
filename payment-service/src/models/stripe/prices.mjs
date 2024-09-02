import stripe from "./stripeInstance";

export class priceModel {
  static getPriceIds = async () => {
    const prices = await stripe.prices.list();
    return prices;
  };

  static getpriceById = async (priceId) => {
    const price = await stripe.prices.retrieve(priceId);
    return price;
  }

  static createPrice = async (productId, priceNumber) => {
    const price = await stripe.prices.create({
      currency: 'usd',
      unit_amount: priceNumber,
      recurring: {
        interval: 'month',
      },
      product: productId
    });
    return price;
  }

  static updatePrice = async (priceId, priceNumber) => {
    const price = await stripe.prices.update(priceId, {
      unit_amount: priceNumber
    });
    return price;
  }
}
