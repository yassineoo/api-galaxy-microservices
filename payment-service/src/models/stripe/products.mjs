import { priceModel } from "./prices.mjs";
import stripe from "./stripeInstance.mjs";

export class productModel {
    static getProducts = async () => {
        try {
            const products = await stripe.products.list();
            return products;
        } catch (error) {
            console.error("Error retrieving products:", error);
            throw error;
        }
    };

    static getProductById = async (productId) => {
        try {
            const product = await stripe.products.retrieve(productId);
            return product;
        } catch (error) {
            console.error(`Error retrieving product with ID ${productId}:`, error);
            throw error;
        }
    }

    static createProduct = async (name, description) => {
        try {
            const product = await stripe.products.create({
                name: name,
                description: description
            });
            return product;
        } catch (error) {
            console.error("Error creating product:", error);
            throw error;
        }
    }

    static updateProduct = async (productId, name, description) => {
        try {
            const product = await stripe.products.update(productId, {
                name: name,
                description: description
            });
            return product;
        } catch (error) {
            console.error(`Error updating product with ID ${productId}:`, error);
            throw error;
        }
    }

    static deleteProduct = async (productId) => {
        try {
            const product = await stripe.products.del(productId);
            return product;
        } catch (error) {
            console.error(`Error deleting product with ID ${productId}:`, error);
            throw error;
        }
    }

    static createProductWithPrice = async (name, description, priceNumber) => {
        try {
            const product = await this.createProduct(name, description);
            const price = priceModel.createPrice(product.id, priceNumber);
            return { product, price };
        } catch (error) {
            console.error("Error creating product with price:", error);
            throw error;
        }
    }
}
