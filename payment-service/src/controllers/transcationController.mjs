import {
  createInvoice,
  getInvoices,
  updateInvoice,
  deleteInvoice,
  createPaymentMethod,
  getPaymentMethods,
  updatePaymentMethod,
  deletePaymentMethod,
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
  getUserTransactions,
} from "../models/local-db/transactions.mjs";

// Controller for creating an invoice
export async function createInvoiceHandler(req, res) {
  try {
    const invoiceData = req.body;
    const newInvoice = await createInvoice(invoiceData);
    res.status(201).json(newInvoice);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Failed to create invoice: ${error.message}` });
  }
}

// Controller for getting all invoices
export async function getInvoicesHandler(req, res) {
  try {
    const invoices = await getInvoices();
    res.status(200).json(invoices);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Failed to fetch invoices: ${error.message}` });
  }
}

// Controller for updating an invoice
export async function updateInvoiceHandler(req, res) {
  try {
    const { id } = req.params;
    const invoiceData = req.body;
    const updatedInvoice = await updateInvoice(BigInt(id), invoiceData);
    res.status(200).json(updatedInvoice);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Failed to update invoice: ${error.message}` });
  }
}

// Controller for deleting an invoice
export async function deleteInvoiceHandler(req, res) {
  try {
    const { id } = req.params;
    await deleteInvoice(BigInt(id));
    res.status(204).send();
  } catch (error) {
    res
      .status(500)
      .json({ error: `Failed to delete invoice: ${error.message}` });
  }
}

// Controller for creating a payment method
export async function createPaymentMethodHandler(req, res) {
  try {
    const paymentMethodData = req.body;
    const newPaymentMethod = await createPaymentMethod(paymentMethodData);
    res.status(201).json(newPaymentMethod);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Failed to create payment method: ${error.message}` });
  }
}

// Controller for getting all payment methods
export async function getPaymentMethodsHandler(req, res) {
  try {
    const paymentMethods = await getPaymentMethods();
    res.status(200).json(paymentMethods);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Failed to fetch payment methods: ${error.message}` });
  }
}

// Controller for updating a payment method
export async function updatePaymentMethodHandler(req, res) {
  try {
    const { id } = req.params;
    const paymentMethodData = req.body;
    const updatedPaymentMethod = await updatePaymentMethod(
      BigInt(id),
      paymentMethodData
    );
    res.status(200).json(updatedPaymentMethod);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Failed to update payment method: ${error.message}` });
  }
}

// Controller for deleting a payment method
export async function deletePaymentMethodHandler(req, res) {
  try {
    const { id } = req.params;
    await deletePaymentMethod(BigInt(id));
    res.status(204).send();
  } catch (error) {
    res
      .status(500)
      .json({ error: `Failed to delete payment method: ${error.message}` });
  }
}

// Controller for creating a transaction
export async function createTransactionHandler(req, res) {
  try {
    const transactionData = req.body;
    const newTransaction = await createTransaction(transactionData);
    res.status(201).json(newTransaction);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Failed to create transaction: ${error.message}` });
  }
}

// Controller for getting all transactions
export async function getTransactionsHandler(req, res) {
  try {
    const transactions = await getTransactions();
    res.status(200).json(transactions);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Failed to fetch transactions: ${error.message}` });
  }
}

// Controller for updating a transaction
export async function updateTransactionHandler(req, res) {
  try {
    const { id } = req.params;
    const transactionData = req.body;
    const updatedTransaction = await updateTransaction(
      BigInt(id),
      transactionData
    );
    res.status(200).json(updatedTransaction);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Failed to update transaction: ${error.message}` });
  }
}

// Controller for deleting a transaction
export async function deleteTransactionHandler(req, res) {
  try {
    const { id } = req.params;
    await deleteTransaction(BigInt(id));
    res.status(204).send();
  } catch (error) {
    res
      .status(500)
      .json({ error: `Failed to delete transaction: ${error.message}` });
  }
}

export async function getUserTransactionsHandler(req, res) {
  try {
    const { userId } = req.params;
    const transactions = await getUserTransactions(BigInt(userId));
    res.status(200).json(transactions);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Failed to fetch transactions for user ${userId}: ${error.message}` });
  }
}
