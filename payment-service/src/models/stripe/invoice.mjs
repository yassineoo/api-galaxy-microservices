import { customerModel } from "./customer.mjs";
import stripe from "./stripeInstance.mjs";

export const createAndFinalizeInvoice = async (email,amount) => {
    try {
      // Create a customer if you don't already have one
      const customer = await customerModel.getCustomerByEmail(email)
  
      // Add an invoice item
      await stripe.invoiceItems.create({
        customer: customer.id,
        amount: amount, // Amount in cents
        currency: 'usd',
        description: 'your description to our API Plan',
      });
  
      // Create the invoice without auto advancing
      const invoice = await stripe.invoices.create({
        customer: customer.id,
        auto_advance: false, // Do not automatically finalize the invoice
      });
  
      console.log('Invoice created but not finalized:', invoice.id);
  
      // Manually finalize the invoice
      const finalizedInvoice = await stripe.invoices.finalizeInvoice(invoice.id);
  
      console.log('Invoice finalized:', finalizedInvoice.id);
      console.log('Invoice status:', finalizedInvoice.status);
      
      if (finalizedInvoice.invoice_pdf) {
        console.log('Invoice PDF URL:', finalizedInvoice.invoice_pdf);
      }
  
    } catch (error) {
      console.error('Error creating or finalizing invoice:', error);
    }
  };
  