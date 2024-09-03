"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAllPermissions = exports.deletePermission = exports.getPermissions = exports.getPermission = exports.createMultiplePermissions = exports.createPermission = void 0;
const prismaClient_1 = require("../utils/prismaClient");
const enum_1 = require("./enum");
const createPermission = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description } = data;
    if (!name || !description) {
        throw new Error("Name or description parameter is undefined");
    }
    const permissions = yield prismaClient_1.prismaClientSingleton.permission_entities.create({
        data: {
            name,
            description,
        },
    });
    return permissions;
});
exports.createPermission = createPermission;
const createMultiplePermissions = (data) => __awaiter(void 0, void 0, void 0, function* () {
    if (!Array.isArray(data) || data.length === 0) {
        throw new Error("Input data is not an array or is empty");
    }
    const permissionsToCreate = [];
    for (const item of data) {
        const { id, permissionId } = item;
        if (!id || !permissionId) {
            throw new Error("User or permission parameter is undefined in one of the items");
        }
        const permissionExists = yield (0, exports.getPermission)({ id, permissionId });
        if (permissionExists !== null) {
            permissionsToCreate.push({
                id: id,
                PermissionID: permissionId,
            });
        }
    }
    if (permissionsToCreate.length === 0) {
        return { message: "No new permissions to create" };
    }
    const result = yield prismaClient_1.prismaClientSingleton.moderator_permission_entities.createMany({
        data: permissionsToCreate,
    });
    return result;
});
exports.createMultiplePermissions = createMultiplePermissions;
const getPermission = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, permissionId } = data;
    if (!id || !permissionId) {
        throw new Error("User or permission parameter is undefined");
    }
    const moderatorpermission = yield prismaClient_1.prismaClientSingleton.moderator_permission_entities.findFirst({
        where: {
            id: id,
            permission_id: typeof permissionId === "number"
                ? enum_1.permissionIds[permissionId]
                : permissionId,
        },
    });
    return moderatorpermission;
});
exports.getPermission = getPermission;
const getPermissions = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!id) {
        throw new Error("User parameter is undefined");
    }
    const moderator_permission_entities = yield prismaClient_1.prismaClientSingleton.moderator_permission_entities.findMany({
        where: {
            id: id,
        },
    });
    return moderator_permission_entities;
});
exports.getPermissions = getPermissions;
const deletePermission = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, permissionId } = data;
    if (!id || !permissionId) {
        throw new Error("User or permission parameter is undefined");
    }
    // Find the ModeratorPermissionID for the given id and permissionId
    const moderatorPermission = yield (0, exports.getPermission)({ id, permissionId });
    if (!moderatorPermission) {
        throw new Error("Moderator permission not found");
    }
    // Deleting the specific moderator permission
    const deletedPermission = yield prismaClient_1.prismaClientSingleton.moderator_permission_entities.delete({
        where: {
            id: moderatorPermission.id,
        },
    });
    // Returns the result of the delete operation
    return deletedPermission;
});
exports.deletePermission = deletePermission;
const deleteAllPermissions = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!id) {
        throw new Error("User parameter is undefined");
    }
    const moderator_permission_entities = yield prismaClient_1.prismaClientSingleton.moderator_permission_entities.deleteMany({
        where: {
            id: id,
        },
    });
    return moderator_permission_entities;
});
exports.deleteAllPermissions = deleteAllPermissions;
