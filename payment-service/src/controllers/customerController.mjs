import { customerModel } from "../models/stripe/customer.mjs";

// Create a new customer
export const createCustomer = async (req, res) => {
  const { email, name } = req.body;
  try {
    const customer = await customerModel.createCustomer(email, name);
    res.status(201).json({ success: true, data: customer });
  } catch (error) {
    console.error("Error creating customer:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Retrieve a customer by ID
export const getCustomerById = async (req, res) => {
  const customerId = req.params.customerId;
  try {
    const customer = await customerModel.getCustomerById(customerId);
    res.status(200).json({ success: true, data: customer });
  } catch (error) {
    console.error("Error retrieving customer:", error);
    res.status(404).json({ success: false, error: error.message });
  }
};

// Update a customer's information
export const updateCustomer = async (req, res) => {
  const customerId = req.params.customerId;
  const updates = req.body;
  try {
    const customer = await customerModel.updateCustomer(customerId, updates);
    res.status(200).json({ success: true, data: customer });
  } catch (error) {
    console.error("Error updating customer:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete a customer by ID
export const deleteCustomer = async (req, res) => {
  const customerId = req.params.customerId;
  try {
    const confirmation = await customerModel.deleteCustomer(customerId);
    res.status(200).json({ success: true, data: confirmation });
  } catch (error) {
    console.error("Error deleting customer:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// List all customers
export const listCustomers = async (req, res) => {
  const params = req.query; // Optional params like limit, starting_after, etc.
  try {
    const customers = await customerModel.listCustomers(params);
    res.status(200).json({ success: true, data: customers });
  } catch (error) {
    console.error("Error listing customers:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
