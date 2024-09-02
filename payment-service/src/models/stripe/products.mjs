import { priceModel } from "./prices.mjs";
import stripe from "./stripeInstance.mjs";

export class productModel {
    static getProducts = async () => {
        const products = await stripe.products.list();
        return products;
    };

    static getProductById = async (productId) => {
        const product = await stripe.products.retrieve(productId);
        return product;
    }

    static createProduct = async (name, description) => {
        const product = await stripe.products.create({
            name: name,
            description: description
        });
        return product;
    }

    static updateProduct = async (productId, name, description) => {
        const product = await stripe.products.update(productId, {
            name: name,
            description: description
        });
        return product;
    }

    static deleteProduct = async (productId) => {
        const product = await stripe.products.del(productId);
        return product;
    }

    static createProductWithPrice = async (name, description, priceNumber) => {
        const product = await this.createProduct(name, description);
        const price = priceModel.createPrice(product.id, priceNumber);
        return { product, price };
    }
}
