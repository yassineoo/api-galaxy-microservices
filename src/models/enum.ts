
export type Permission = 'viewContent' | 'editContent' | 'deleteContent' | 'addContent' | 'manageUsers' | 'manageRoles';
export type Role = 'superadmin' | 'admin' | 'moderator' | 'user';

interface RolePermissions {
    [role: string]: Permission[];
}

export const permissionIds : any = {
    viewContent: 1,
    editContent: 2,
    deleteContent: 3,
    addContent: 4,
    manageUsers: 5,
    manageRoles: 6
}

export const defaultRolePermissions: RolePermissions = {
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