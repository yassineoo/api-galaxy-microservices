import userModel from "../models/userModel";

export default class ADService {

    static deactivateAccount = async (id: number) => {
        //we will manage the permissions here
        userModel.updateUser(id, {IsActive : false});
    }

    static activateAccount = async (id: number) => {
        userModel.updateUser(id, {IsActive : true});
    }
}