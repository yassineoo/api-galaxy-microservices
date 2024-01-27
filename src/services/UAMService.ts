import userModel from "../models/userModel";
import { Role, defaultRolePermissions, permissionIds } from "../models/enum";
import { createMultiplePermissions, getPermissions } from "../models/permissions";

export default class userService {

    static  getUserById = async (id: number) => {

        if (!Number.isInteger(id)) {
            throw new Error("ID must be an integer");
        }
        const user = await userModel.getUserById(id);

        return user;
    }

    static  getAllUsers = async () => {
        const users = await userModel.getAllUsers();
        return users;
    }

    static  updateUser = async (id: number, data: any) => {
        if (!Number.isInteger(id)) {
            throw new Error("ID must be an integer");
        }
        const user = await userModel.updateUser(id, data);
        return user;

    }

    static  deleteUser = async (id: number) => {
        if (!Number.isInteger(id)) {
            throw new Error("ID must be an integer");
        }
        userModel.deleteUser(id);
    }



    static  getUserRole = async (id: number) => {
        const user = await userModel.getUserById(id);

        if (!user) {
            throw new Error("User not found");
        }
        return user.role;
    }
    static  updateRole = async (id: number, role: Role) => {
        //check if user exists
        if (!Number.isInteger(id)) {
            throw new Error("ID must be an integer");
        }

        //check if user exists
        const user = await userModel.getUserById(id);
        if (!user) {
            throw new Error("User not found");
        }
        const roles = user.role;

        //check if user already has this role
        if ((roles) && (roles.includes(role))) {
            throw new Error("User already has this role");
        }

        //update user role
        const updatedUser = await userModel.updateUser(user.UserID, { role: roles });
        if (!updatedUser) {
            throw new Error("User not found");
        }

        //add permissions to user if he is a moderator
        let addedPermissions;
        if (role === 'moderator') {
            const permissionId = defaultRolePermissions[role].map(item => (permissionIds[item]));
            const array = permissionId.map(item => ({ userId: user.UserID, permissionId: item }));
            const addedPermissions = await createMultiplePermissions(array);
        }

        //check if permissions were added
        if (!addedPermissions) {
            throw new Error("Error adding permissions");
        }

        return updatedUser;

    }



    static  getModeratorPermissions = async (id: number) => {
        if (!Number.isInteger(id)) {
            throw new Error("ID must be an integer");
        }
        getPermissions(id);
    }
    static  addModeratorPermission = (id: number, permission: string) => {
        if (!Number.isInteger(id)) {
            throw new Error("ID must be an integer");
        }
    }
}
