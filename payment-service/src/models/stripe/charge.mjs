import stripe from "./stripeInstance.mjs";

export async function chargeClientForApiCall(customerId, amountInCents) {
    try {
        // Create a new charge for the client
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents, // Amount in cents (0.10$ -> 10 cents)
            currency: 'usd',
            customer: customerId, // Stripe customer ID of the client
            description: 'API call charge',
        });

        // Return the payment intent to verify if payment succeeded
        return paymentIntent;
    } catch (error) {
        console.error('Error charging client:', error);
        throw error;
    }
}