import { priceModel } from "./prices";
import stripe from "./stripeInstance";

export class productModel {
    static getProducts = async () => {
        const products = await stripe.products.list();
        return products;
    };

    static getProductById = async (productId: string) => {
        const product = await stripe.products.retrieve(productId);
        return product;
    }

    static createProduct = async (name: string, description: string) => {
        const product = await stripe.products.create({
            name: name,
            description: description
        });
        return product;
    }

    static updateProduct = async (productId: string, name: string, description: string) => {
        const product = await stripe.products.update(productId, {
            name: name,
            description: description
        });
        return product;
    }

    static deleteProduct = async (productId: string) => {
        const product = await stripe.products.del(productId);
        return product;
    }

    static createProductWithPrice = async (name: string, description: string, priceNumber: number) => {
        const product = await this.createProduct(name, description);
        const price = priceModel.createPrice(product.id, priceNumber);
        return { product, price };
    }
}