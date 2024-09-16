import { customerModel } from "./customer.mjs";
import stripe from "./stripeInstance.mjs";

export const createAndFinalizeInvoice = async (email, amount) => {
  try {
    // Create a customer if you don't already have one
    const customer = await customerModel.getCustomerByEmail(email)
    console.log('Customer:', customer);

    // Add an invoice item
    await stripe.invoiceItems.create({
      customer: customer[0].id,
      amount: amount, // Amount in cents
      currency: 'usd',
      description: 'your subscription to our API Plan',
    });

    // Create the invoice without auto advancing
    const invoice = await stripe.invoices.create({
      customer: customer[0].id,
      auto_advance: false, // Do not automatically finalize the invoice
    });

    console.log('Invoice created but not finalized:', invoice.id);

    // Manually finalize the invoice
    const finalizedInvoice = await stripe.invoices.finalizeInvoice(invoice.id);

    console.log('Invoice finalized:', finalizedInvoice.id);
    console.log('Invoice status:', finalizedInvoice.status);

    if (finalizedInvoice.invoice_pdf) {
      console.log('Invoice PDF URL:', finalizedInvoice.invoice_pdf);
      return finalizedInvoice.invoice_pdf;
    }

  } catch (error) {
    console.error('Error creating or finalizing invoice:', error);
  }
};


export const getSession = async (sessionId) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return session;
  } catch (error) {
    console.error('Error retrieving session:', error);
    throw error;
  }
}