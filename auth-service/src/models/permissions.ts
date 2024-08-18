import { prismaClientSingleton } from "../utils/prismaClient";
import { Permission, permissionIds } from "./enum";

export const createPermission = async (data: {
  name: string;
  description: string;
}) => {
  const { name, description } = data;
  if (!name || !description) {
    throw new Error("Name or description parameter is undefined");
  }
  const permissions = await prismaClientSingleton.permission_entities.create({
    data: {
      name,
      description,
    },
  });
  return permissions;
};

export const createMultiplePermissions = async (
  data: Array<{ id: number; permissionId: number }>
) => {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("Input data is not an array or is empty");
  }

  const permissionsToCreate = [];

  for (const item of data) {
    const { id, permissionId } = item;
    if (!id || !permissionId) {
      throw new Error(
        "User or permission parameter is undefined in one of the items"
      );
    }

    const permissionExists = await getPermission({ id, permissionId });
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

  const result =
    await prismaClientSingleton.moderator_permission_entities.createMany({
      data: permissionsToCreate,
    });

  return result;
};

export const getPermission = async (data: {
  id: number;
  permissionId: Permission | number;
}) => {
  const { id, permissionId } = data;
  if (!id || !permissionId) {
    throw new Error("User or permission parameter is undefined");
  }
  const moderatorpermission =
    await prismaClientSingleton.moderator_permission_entities.findFirst({
      where: {
        id: id,
        permission_id:
          typeof permissionId === "number"
            ? permissionIds[permissionId]
            : permissionId,
      },
    });
  return moderatorpermission;
};

export const getPermissions = async (id: number) => {
  if (!id) {
    throw new Error("User parameter is undefined");
  }
  const moderator_permission_entities =
    await prismaClientSingleton.moderator_permission_entities.findMany({
      where: {
        id: id,
      },
    });
  return moderator_permission_entities;
};

export const deletePermission = async (data: {
  id: number;
  permissionId: number;
}) => {
  const { id, permissionId } = data;

  if (!id || !permissionId) {
    throw new Error("User or permission parameter is undefined");
  }

  // Find the ModeratorPermissionID for the given id and permissionId
  const moderatorPermission = await getPermission({ id, permissionId });

  if (!moderatorPermission) {
    throw new Error("Moderator permission not found");
  }

  // Deleting the specific moderator permission
  const deletedPermission =
    await prismaClientSingleton.moderator_permission_entities.delete({
      where: {
        id: moderatorPermission.id,
      },
    });

  // Returns the result of the delete operation
  return deletedPermission;
};

export const deleteAllPermissions = async (id: number) => {
  if (!id) {
    throw new Error("User parameter is undefined");
  }
  const moderator_permission_entities =
    await prismaClientSingleton.moderator_permission_entities.deleteMany({
      where: {
        id: id,
      },
    });
  return moderator_permission_entities;
};
