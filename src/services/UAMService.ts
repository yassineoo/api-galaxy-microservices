import { get } from "http";
import { deleteUser, getAllUsers, getUserById, updateUser } from "../models/userModel"
import { Role, defaultRolePermissions, permissionIds } from "../models/enum";
import { createMultiplePermissions } from "../models/permissions";


export const getUserByIdService = async (id: number) => {

    if (!Number.isInteger(id)) {
        throw new Error("ID must be an integer");
    }
    const user = await getUserById(id);

    return user;
}

export const getAllUsersService = async () => {
    const users = await getAllUsers();
    return users;
}

export const deleteAccount = async (id: number) => {
    if (!Number.isInteger(id)) {
        throw new Error("ID must be an integer");
    }
    deleteUser(id);
}


export const updateRole = async (id: number, role: Role) => {
    if (!Number.isInteger(id)) {
        throw new Error("ID must be an integer");
    }

    const user = await getUserById(id);
    if (!user) {
        throw new Error("User not found");
    }

    const roles = user.role;

    if ((roles) && (roles.includes(role))) {
        throw new Error("User already has this role");
    }
    const updatedUser = await updateUser(user.UserID, { role: roles });
    if (!updatedUser) {
        throw new Error("User not found");
    }

    let addedPermissions;
    if (role === 'moderator' ) {
        const permissionId = defaultRolePermissions[role].map(item => (permissionIds[item]));
        const array = permissionId.map(item => ({ userId: user.UserID, permissionId: item }));
        addedPermissions = await createMultiplePermissions(array);
    }

    if(!addedPermissions){
        throw new Error("Error adding permissions");
    }

    return updatedUser;

}

export const addModeratorPermission = (id: number, permission: string) => {
    if (!Number.isInteger(id)) {
        throw new Error("ID must be an integer");
    }
}

