import { deleteUser } from "../models/userModel"


export const deleteAccount = async (id: number) => {
    deleteUser(id);
}