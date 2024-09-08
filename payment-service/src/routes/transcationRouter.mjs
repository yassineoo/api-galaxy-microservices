import express from 'express';
import {
  createInvoiceHandler,
  getInvoicesHandler,
  updateInvoiceHandler,
  deleteInvoiceHandler,
  createPaymentMethodHandler,
  getPaymentMethodsHandler,
  updatePaymentMethodHandler,
  deletePaymentMethodHandler,
  createTransactionHandler,
  getTransactionsHandler,
  updateTransactionHandler,
  deleteTransactionHandler,
  getUserTransactionsHandler,
} from '../controllers/transcationController.mjs';

const transactionRouter = express.Router();

// Invoice routes
transactionRouter.post('/invoices', createInvoiceHandler);
transactionRouter.get('/invoices', getInvoicesHandler);
transactionRouter.put('/invoices/:id', updateInvoiceHandler);
transactionRouter.delete('/invoices/:id', deleteInvoiceHandler);

// Payment Method routes
transactionRouter.post('/payment-methods', createPaymentMethodHandler);
transactionRouter.get('/payment-methods', getPaymentMethodsHandler);
transactionRouter.put('/payment-methods/:id', updatePaymentMethodHandler);
transactionRouter.delete('/payment-methods/:id', deletePaymentMethodHandler);

// Transaction routes
transactionRouter.post('/transactions', createTransactionHandler);
transactionRouter.get('/transactions', getTransactionsHandler);
transactionRouter.get('/transactions/:userId', getUserTransactionsHandler);
transactionRouter.put('/transactions/:id', updateTransactionHandler);
transactionRouter.delete('/transactions/:id', deleteTransactionHandler);

export default transactionRouter;
