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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const userModel_1 = __importDefault(require("../models/userModel"));
const enum_1 = require("../models/enum");
const permissions_1 = require("../models/permissions");
class userService {
}
_a = userService;
/**
 * Retrieves a user by their ID.
 * @param id - The ID of the user.
 * @returns The user object.
 * @throws Error if the ID is not an integer.
 */
userService.getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!Number.isInteger(id)) {
        throw new Error("ID must be an integer");
    }
    const user = yield userModel_1.default.getUserById(id);
    return user;
});
/**
 * Retrieves all users.
 * @returns {Promise<User[]>} A promise that resolves to an array of users.
 */
userService.getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield userModel_1.default.getAllUsers();
    return users;
});
/**
 * Updates a user with the specified ID.
 * @param id - The ID of the user to update.
 * @param data - The data to update the user with.
 * @returns The updated user.
 * @throws Error if the ID is not an integer.
 */
userService.updateUser = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    if (!Number.isInteger(id)) {
        throw new Error("ID must be an integer");
    }
    const user = yield userModel_1.default.updateUser(id, data);
    return user;
});
/**
 * Deletes a user by their ID.
 * @param id - The ID of the user to delete.
 * @throws Error if the ID is not an integer.
 */
userService.deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!Number.isInteger(id)) {
        throw new Error("ID must be an integer");
    }
    userModel_1.default.deleteUser(id);
});
/**
 * Retrieves the role of a user by their ID.
 * @param id - The ID of the user.
 * @returns The role of the user.
 * @throws Error if the user is not found.
 */
userService.getUserRole = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userModel_1.default.getUserById(id);
    if (!user) {
        throw new Error("User not found");
    }
    return user.role;
});
/**
 * Updates the role of a user.
 *
 * @param id - The ID of the user.
 * @param role - The new role for the user.
 * @returns The updated user object.
 * @throws Error if the ID is not an integer, user is not found, user already has the role, or there is an error adding permissions.
 */
userService.updateRole = (id, role) => __awaiter(void 0, void 0, void 0, function* () {
    //check if user exists
    if (!Number.isInteger(id)) {
        throw new Error("ID must be an integer");
    }
    //check if user exists
    const user = yield userModel_1.default.getUserById(id);
    if (!user) {
        throw new Error("User not found");
    }
    const roles = user.role;
    //check if user already has this role
    if (roles && roles.includes(role)) {
        throw new Error("User already has this role");
    }
    //update user role
    const updatedUser = yield userModel_1.default.updateUser(Number(user.id), {
        role: roles,
    });
    if (!updatedUser) {
        throw new Error("User not found");
    }
    //add permissions to user if he is a moderator
    let addedPermissions;
    if (role === "moderator") {
        const permissionId = enum_1.defaultRolePermissions[role].map((item) => enum_1.permissionIds[item]);
        const array = permissionId.map((item) => ({
            id: Number(user.id),
            permissionId: item,
        }));
        const addedPermissions = yield (0, permissions_1.createMultiplePermissions)(array);
    }
    //check if permissions were added
    if (!addedPermissions) {
        throw new Error("Error adding permissions");
    }
    return updatedUser;
});
/**
 * Retrieves the moderator permissions for a given ID.
 * @param id - The ID of the user.
 * @throws {Error} If the ID is not an integer.
 */
userService.getModeratorPermissions = (id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!Number.isInteger(id)) {
        throw new Error("ID must be an integer");
    }
    (0, permissions_1.getPermissions)(id);
});
/**
 * Adds a moderator permission to a user.
 * @param id - The ID of the user.
 * @param permission - The moderator permission to add.
 * @throws Error if the ID is not an integer.
 */
userService.addModeratorPermission = (id, permission) => {
    if (!Number.isInteger(id)) {
        throw new Error("ID must be an integer");
    }
};
exports.default = userService;
