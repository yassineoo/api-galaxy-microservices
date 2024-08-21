import userModel from "../models/userModel";
import { Role, defaultRolePermissions, permissionIds } from "../models/enum";
import {
  createMultiplePermissions,
  getPermissions,
} from "../models/permissions";
import profileModel from "../models/profileModel";
import UPMService from "./UPMService";

export default class userService {
  /**
   * Retrieves a user by their ID.
   * @param id - The ID of the user.
   * @returns The user object.
   * @throws Error if the ID is not an integer.
   */
  static getUserById = async (id: number) => {
    if (!Number.isInteger(id)) {
      throw new Error("ID must be an integer");
    }
    const user = await userModel.getUserById(id);

    return user;
  };

  /**
   * Retrieves all users.
   * @returns {Promise<User[]>} A promise that resolves to an array of users.
   */
  static getAllUsers = async () => {
    const users = await userModel.getAllUsers();
    return users;
  };

  /**
   * Updates a user with the specified ID.
   * @param id - The ID of the user to update.
   * @param data - The data to update the user with.
   * @returns The updated user.
   * @throws Error if the ID is not an integer.
   */
  static updateUser = async (id: number, data: any) => {
    if (!Number.isInteger(id)) {
      throw new Error("ID must be an integer");
    }
    const user = await userModel.updateUser(id, data);
    return user;
  };

  /**
   * Deletes a user by their ID.
   * @param id - The ID of the user to delete.
   * @throws Error if the ID is not an integer.
   */
  static deleteUser = async (id: number) => {
    if (!Number.isInteger(id)) {
      throw new Error("ID must be an integer");
    }
    userModel.deleteUser(id);
  };

  /**
   * Retrieves the role of a user by their ID.
   * @param id - The ID of the user.
   * @returns The role of the user.
   * @throws Error if the user is not found.
   */
  static getUserRole = async (id: number) => {
    const user = await userModel.getUserById(id);

    if (!user) {
      throw new Error("User not found");
    }
    return user.role;
  };

  /**
   * Updates the role of a user.
   *
   * @param id - The ID of the user.
   * @param role - The new role for the user.
   * @returns The updated user object.
   * @throws Error if the ID is not an integer, user is not found, user already has the role, or there is an error adding permissions.
   */
  static updateRole = async (id: number, role: Role) => {
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
    if (roles && roles.includes(role)) {
      throw new Error("User already has this role");
    }

    //update user role
    const updatedUser = await userModel.updateUser(Number(user.id), {
      role: roles,
    });
    if (!updatedUser) {
      throw new Error("User not found");
    }

    //add permissions to user if he is a moderator
    let addedPermissions;
    if (role === "moderator") {
      const permissionId = defaultRolePermissions[role].map(
        (item) => permissionIds[item]
      );
      const array = permissionId.map((item) => ({
        id: Number(user.id),
        permissionId: item,
      }));
      const addedPermissions = await createMultiplePermissions(array);
    }

    //check if permissions were added
    if (!addedPermissions) {
      throw new Error("Error adding permissions");
    }

    return updatedUser;
  };

  /**
   * Retrieves the moderator permissions for a given ID.
   * @param id - The ID of the user.
   * @throws {Error} If the ID is not an integer.
   */
  static getModeratorPermissions = async (id: number) => {
    if (!Number.isInteger(id)) {
      throw new Error("ID must be an integer");
    }
    getPermissions(id);
  };

  /**
   * Adds a moderator permission to a user.
   * @param id - The ID of the user.
   * @param permission - The moderator permission to add.
   * @throws Error if the ID is not an integer.
   */
  static addModeratorPermission = (id: number, permission: string) => {
    if (!Number.isInteger(id)) {
      throw new Error("ID must be an integer");
    }
  };
}
