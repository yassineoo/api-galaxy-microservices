import { accountModel } from "../models/stripe/accounts.mjs";


export const createAccountWithIban = async (req, res) => {
    console.log("req.body", req.body);
    const { email, fullName, iban } = req.body;
    try {
        const account = await accountModel.createAccountWithIban(email, fullName, iban);
        res.status(201).json({ success: true, data: account });
    } catch (error) {
        console.error("Error creating account:", error);
        res.status(500).json({ success: false, error: error.message });
    }
}