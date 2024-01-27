import userModel from "../models/userModel";

export default class ADService {

    static deactivateAccount = async (id: number) => {
        //we will manage the permissions here
        userModel.setActivatedAccount(id, false);
    }

    static activateAccount = async (id: number) => {
        userModel.setActivatedAccount(id, true);
    }
}