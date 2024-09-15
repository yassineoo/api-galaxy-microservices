import stripe from "./stripeInstance.mjs";

export class accountModel {
    static createAccountWithIban = async (email, fullName, iban) => {
        try {
            const account = await stripe.accounts.create({
                type: 'express',
                country: 'FR',
                capabilities: {
                    transfers: { requested: true },
                },
                business_type: 'individual', // or 'company' if they are a business
                email: email, // Provider's email
            });
            const bankAccount = await stripe.accounts.createExternalAccount(
                account.id, // Connected account ID of the provider
                {
                    external_account: {
                        object: 'bank_account',
                        country: 'FR', // The country of the bank
                        currency: 'usd', // Currency to be used for the payout (EUR for IBAN)
                        account_holder_name: fullName, // The provider's name
                        account_holder_type: 'individual', // Can also be 'company' if they are a business
                        iban: iban, // Provider's IBAN number
                    },
                }
            );
            // Add any additional code here
        } catch (error) {
            // Handle the error here
            console.error('Error creating account:', error);
        }
    };
}