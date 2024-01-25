import { permissions } from '@prisma/client';
import { prismaClientSingleton } from '../utils/prismaClient';
import { Permission, permissionIds } from './enum';
import { get } from 'http';

export const createPermission = async (data: { name: string, description: string }) => {
    const { name, description } = data;
    if ((!name) || (!description)) {
        throw new Error("Name or description parameter is undefined");
    }
    const permissions = await prismaClientSingleton.permissions.create({
        data: {
            Name: name,
            Description: description,
        }
    });
    return permissions;
}


export const createMultiplePermissions = async (data: Array<{ userId: number, permissionId: number }>) => {
    if (!Array.isArray(data) || data.length === 0) {
        throw new Error("Input data is not an array or is empty");
    }

    const permissionsToCreate = [];

    for (const item of data) {
        const { userId, permissionId } = item;
        if (!userId || !permissionId) {
            throw new Error("User or permission parameter is undefined in one of the items");
        }

        const permissionExists = await getPermission({ userId, permissionId });
        if (permissionExists !== null) {
            permissionsToCreate.push({
                UserID: userId,
                PermissionID: permissionId
            });
        }
    }

    if (permissionsToCreate.length === 0) {
        return { message: 'No new permissions to create' };
    }

    const result = await prismaClientSingleton.moderatorpermissions.createMany({
        data: permissionsToCreate
    });

    return result;
}

export const getPermission = async (data: { userId: number, permissionId: Permission | number }) => {   
    const { userId, permissionId } = data;
    if (!userId || !permissionId) {
        throw new Error("User or permission parameter is undefined");
    }
    const moderatorpermission = await prismaClientSingleton.moderatorpermissions.findFirst({
        where: {
            UserID: userId,
            PermissionID: typeof permissionId ==="number" ?  permissionIds[permissionId] : permissionId
        }
    });
    return moderatorpermission;
}

export const getPermissions = async (id: number) => {
    if (!id) {
        throw new Error("User parameter is undefined");
    }
    const moderatorpermissions = await prismaClientSingleton.moderatorpermissions.findMany({
        where: {
            UserID: id
        }
    });
    return moderatorpermissions;
}

export const deleteUserPermission = async (data: { userId: number, permissionId: number }) => {
    const { userId, permissionId } = data;

    if (!userId || !permissionId) {
        throw new Error("User or permission parameter is undefined");
    }

    // Find the ModeratorPermissionID for the given userId and permissionId
    const moderatorPermission = await getPermission({ userId, permissionId })

    if (!moderatorPermission) {
        throw new Error("Moderator permission not found");
    }

    // Deleting the specific moderator permission
    const deletedPermission = await prismaClientSingleton.moderatorpermissions.delete({
        where: {
            ModeratorPermissionID: moderatorPermission.ModeratorPermissionID
        }
    });

    // Returns the result of the delete operation
    return deletedPermission;
}


export const deleteAllmoderatorpermissions = async (id: number) => {
    if (!id) {
        throw new Error("User parameter is undefined");
    }
    const moderatorpermissions = await prismaClientSingleton.moderatorpermissions.deleteMany({
        where: {
            UserID: id
        }
    });
    return moderatorpermissions;
}