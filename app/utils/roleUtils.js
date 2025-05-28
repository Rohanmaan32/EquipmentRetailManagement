export const roles = {
    ADMIN: 'admin',
    STAFF: 'staff',
    CUSTOMER: 'customer',
};

export const permissions = {
    [roles.ADMIN]: ['create', 'edit', 'delete', 'view'],
    [roles.STAFF]: ['edit', 'view'],
    [roles.GUEST]: ['view'],
};

export const hasPermission = (role, permission) => {
    return permissions[role] && permissions[role].includes(permission);
};