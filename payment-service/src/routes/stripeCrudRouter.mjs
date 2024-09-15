import express from 'express';
import {
  createCustomer,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  listCustomers,
  getCustomerByEmail,

} from '../controllers/customerController.mjs';

import {
  createPrice,
  getPrices,
  getCustomerTransactionHistory,

} from '../controllers/priceController.mjs';

import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductWithPrice,

} from '../controllers/productController.mjs';
import { createAccountWithIban } from '../controllers/accountController.mjs';


const stripeCrudRouter = express.Router();

// Customer Routes
stripeCrudRouter.post('/customers', createCustomer); // Create a new customer
stripeCrudRouter.get('/customers', listCustomers); // List all customers
stripeCrudRouter.get('/customers/:customerId', getCustomerById); // Retrieve a customer by ID
stripeCrudRouter.get('/customers/email/:email', getCustomerByEmail); // Retrieve a customer by email
stripeCrudRouter.put('/customers/:customerId', updateCustomer); // Update a customer's information
stripeCrudRouter.delete('/customers/:customerId', deleteCustomer); // Delete a customer by ID

// Customer Transaction History Route
stripeCrudRouter.get('/customers/:customerId/transactions', getCustomerTransactionHistory); // Get customer transaction history

// Product Routes
stripeCrudRouter.get('/products', getProducts); // Get all products
stripeCrudRouter.get('/products/:productId', getProductById); // Get a product by ID
stripeCrudRouter.post('/products', createProduct); // Create a new product
stripeCrudRouter.put('/products/:productId', updateProduct); // Update a product by ID
stripeCrudRouter.delete('/products/:productId', deleteProduct); // Delete a product by ID
stripeCrudRouter.post('/products/with-price', createProductWithPrice); // Create a new product with a price

stripeCrudRouter.post('/prices', createPrice); // Create a new price
stripeCrudRouter.get('/prices/:productId', getPrices); // Get prices of a specific product by product ID

stripeCrudRouter.post('/account',createAccountWithIban);

export default stripeCrudRouter;
