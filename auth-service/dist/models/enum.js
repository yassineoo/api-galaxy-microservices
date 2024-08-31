"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultRolePermissions = exports.permissionIds = void 0;
exports.permissionIds = {
    viewContent: 1,
    editContent: 2,
    deleteContent: 3,
    addContent: 4,
    manageUsers: 5,
    manageRoles: 6
};
exports.defaultRolePermissions = {
    admin: ['viewContent',
        'editContent',
        'deleteContent',
        'addContent',
        'manageUsers',
        'manageRoles'],
    moderator: ['viewContent',
        'editContent'],
    userClient: ['viewContent'],
    userProvider: ['viewContent']
};
