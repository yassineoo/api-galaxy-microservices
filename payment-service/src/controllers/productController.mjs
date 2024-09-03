import { updateApiEntity } from "../models/local-db/extra.mjs";
import { productModel } from "../models/stripe/products.mjs";

// Get all products
export const getProducts = async (req, res) => {
  try {
    const products = await productModel.getProducts();
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get a product by ID
export const getProductById = async (req, res) => {
  const { productId } = req.params;
  try {
    const product = await productModel.getProductById(productId);
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    res.status(404).json({ success: false, error: error.message });
  }
};

// Create a new product
export const createProduct = async (req, res) => {
  const { name, description, apiId } = req.body;
  try {
    const product = await productModel.createProduct(name, description);
    res.status(201).json({ success: true, data: product });
    //add productID to entity
    const updatedApiEntity = await updateApiEntity(apiId, {
      stripe_product_id: product.id,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update a product by ID
export const updateProduct = async (req, res) => {
  const { productId } = req.params;
  const { name, description } = req.body;
  try {
    const product = await productModel.updateProduct(productId, name, description);
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete a product by ID
export const deleteProduct = async (req, res) => {
  const { productId } = req.params;
  try {
    const result = await productModel.deleteProduct(productId);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Create a new product with a price
export const createProductWithPrice = async (req, res) => {
  const { name, description, priceNumber } = req.body;
  try {
    const { product, price } = await productModel.createProductWithPrice(name, description, priceNumber);
    res.status(201).json({ success: true, data: { product, price } });
  } catch (error) {
    console.error("Error creating product with price:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
