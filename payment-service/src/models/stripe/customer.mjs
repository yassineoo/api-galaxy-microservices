import stripe from "./stripeInstance";

export class customerModel {
  // Create a new customer
  static createCustomer = async (email, name) => {
    const customer = await stripe.customers.create({
      email: email,
      name: name,
    });
    return customer;
  };

  // Retrieve a customer by ID
  static getCustomerById = async (customerId) => {
    const customer = await stripe.customers.retrieve(customerId);
    return customer;
  };

  // Update a customer's information
  static updateCustomer = async (customerId, updates) => {
    const customer = await stripe.customers.update(customerId, updates);
    return customer;
  };

  // Delete a customer by ID
  static deleteCustomer = async (customerId) => {
    const confirmation = await stripe.customers.del(customerId);
    return confirmation;
  };

  // List all customers (with optional parameters)
  static listCustomers = async (params = {}) => {
    const customers = await stripe.customers.list(params);
    return customers;
  };
}
