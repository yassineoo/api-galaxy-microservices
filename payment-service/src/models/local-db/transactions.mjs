import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Utility function to convert BigInt to String
function convertBigIntToString(obj) {
  if (typeof obj !== 'object' || obj === null) return obj;

  for (const key in obj) {
    if (typeof obj[key] === 'bigint') {
      obj[key] = obj[key].toString();
    } else if (typeof obj[key] === 'object') {
      convertBigIntToString(obj[key]); // Recursively handle nested objects
    }
  }
  return obj;
}



//Create a Payment Method
async function createPaymentMethod(data) {
  try {
    const newPaymentMethod = await prisma.payment_method_entities.create({
      data,
    });
    return convertBigIntToString(newPaymentMethod); // Convert BigInt before returning
  } catch (error) {
    throw new Error(`Failed to create payment method: ${error.message}`);
  }
}

// Read Payment Methods
async function getPaymentMethods() {
  try {
    const paymentMethods = await prisma.payment_method_entities.findMany({
      include: {
        transaction_entities: true, // Includes related transactions
      },
    });
    return paymentMethods.map(convertBigIntToString); // Convert BigInt in each item
  } catch (error) {
    throw new Error(`Failed to fetch payment methods: ${error.message}`);
  }
}

// Update a Payment Method
async function updatePaymentMethod(id, data) {
  try {
    const updatedPaymentMethod = await prisma.payment_method_entities.update({
      where: { id },
      data,
    });
    return convertBigIntToString(updatedPaymentMethod); // Convert BigInt before returning
  } catch (error) {
    throw new Error(`Failed to update payment method: ${error.message}`);
  }
}

// Delete a Payment Method
async function deletePaymentMethod(id) {
  try {
    const deletedPaymentMethod = await prisma.payment_method_entities.delete({
      where: { id },
    });
    return convertBigIntToString(deletedPaymentMethod); // Convert BigInt before returning
  } catch (error) {
    throw new Error(`Failed to delete payment method: ${error.message}`);
  }
}

// CRUD Operations for Invoice

// Create an Invoice
async function createInvoice(data) {
  try {
    const newInvoice = await prisma.invoice_entities.create({
      data,
    });
    return convertBigIntToString(newInvoice); // Convert BigInt before returning
  } catch (error) {
    throw new Error(`Failed to create invoice: ${error.message}`);
  }
}

// Read Invoices
async function getInvoices() {
  try {
    const invoices = await prisma.invoice_entities.findMany({
      include: {
        billing_history_entities: true, // Includes related billing history
        transaction_entities: true, // Includes related transactions
      },
    });
    return invoices.map(convertBigIntToString); // Convert BigInt in each item
  } catch (error) {
    throw new Error(`Failed to fetch invoices: ${error.message}`);
  }
}

// Update an Invoice
async function updateInvoice(id, data) {
  try {
    const updatedInvoice = await prisma.invoice_entities.update({
      where: { id },
      data,
    });
    return convertBigIntToString(updatedInvoice); // Convert BigInt before returning
  } catch (error) {
    throw new Error(`Failed to update invoice: ${error.message}`);
  }
}

// Delete an Invoice
async function deleteInvoice(id) {
  try {
    const deletedInvoice = await prisma.invoice_entities.delete({
      where: { id },
    });
    return convertBigIntToString(deletedInvoice); // Convert BigInt before returning
  } catch (error) {
    throw new Error(`Failed to delete invoice: ${error.message}`);
  }
}

// CRUD Operations for Transaction

// Create a Transaction
async function createTransaction(data) {
  try {
    const newTransaction = await prisma.transaction_entities.create({
      data,
    });
    return convertBigIntToString(newTransaction); // Convert BigInt before returning
  } catch (error) {
    throw new Error(`Failed to create transaction: ${error.message}`);
  }
}

// Read Transactions
async function getTransactions() {
  try {
    const transactions = await prisma.transaction_entities.findMany({
      include: {
        invoice_entities: true, // Includes related invoice details
      },
    });
    return transactions.map(convertBigIntToString); // Convert BigInt in each item
  } catch (error) {
    throw new Error(`Failed to fetch transactions: ${error.message}`);
  }
}
async function getUserTransactions(userId) {
  try {
    // Fetch all transactions directly related to user's invoices by using user_id on invoice_entities table
    const transactions = await prisma.transaction_entities.findMany({
      where: {
        invoice_entities: {
          subscription_entities: {
            user_id: userId
          }
        }
      },
      include: {
        invoice_entities: true, // Optionally include related invoice details
      },
    });

    return transactions.map(convertBigIntToString); // Convert BigInt to string for each item
  } catch (error) {
    throw new Error(`Failed to fetch transactions for user ${userId}: ${error.message}`);
  }
}


// Update a Transaction
async function updateTransaction(id, data) {
  try {
    const updatedTransaction = await prisma.transaction_entities.update({
      where: { id },
      data,
    });
    return convertBigIntToString(updatedTransaction); // Convert BigInt before returning
  } catch (error) {
    throw new Error(`Failed to update transaction: ${error.message}`);
  }
}

// Delete a Transaction
async function deleteTransaction(id) {
  try {
    const deletedTransaction = await prisma.transaction_entities.delete({
      where: { id },
    });
    return convertBigIntToString(deletedTransaction); // Convert BigInt before returning
  } catch (error) {
    throw new Error(`Failed to delete transaction: ${error.message}`);
  }
}

// Exporting functions
export {
  createPaymentMethod,
  getPaymentMethods,
  updatePaymentMethod,
  deletePaymentMethod,
  createInvoice,
  getInvoices,
  updateInvoice,
  deleteInvoice,
  createTransaction,
  getTransactions,
  getUserTransactions,
  updateTransaction,
  deleteTransaction,
};
