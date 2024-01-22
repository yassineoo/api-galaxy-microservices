import { setActivatedAccount } from "../models/userModel"

export const deactivateAccountService = async (id: number) => {
    //we will manage the permissions here
    setActivatedAccount(id,false);
}

export const activateAccountService = async (id: number) => {
    setActivatedAccount(id,true);
}