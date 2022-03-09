export enum SystemRole {
    ADMIN = "Admin",
    USER = "User",
    GUEST = "Guest",
}

export type SystemRoleProp = {
    parent?: SystemRole;
};

export const SystemRoleMap: { [role: string]: SystemRoleProp } = {
    [SystemRole.USER]: {},
    [SystemRole.ADMIN]: { parent: SystemRole.USER },
};

export function getExtendedSystemRoles(role: SystemRole): SystemRole[] {
    const result: SystemRole[] = [role];
    while (SystemRoleMap[role]?.parent) {
        role = SystemRoleMap[role]?.parent;
        result.push(role);
    }
    return result;
}

export enum UserErrorCode {
    BAD_REQUEST_DEVICE_IDENDIFIED = "BAD_REQUEST_DEVICE_IDENDIFIED",
    BAD_REQUEST_WRONG_PASSWORD = "BAD_REQUEST_WRONG_PASSWORD",
    BAD_REQUEST_EMPTY_CLIENT_DEVICE_ID = "BAD_REQUEST_EMPTY_CLIENT_DEVICE_ID",
    BAD_REQUEST_CLIENT_DEVICE_ID_EXIST = "BAD_REQUEST_CLIENT_DEVICE_ID_EXIST",
    BAD_REQUEST_WRONG_OLD_PASSWORD = "BAD_REQUEST_WRONG_OLD_PASSWORD",
    BAD_REQUEST_DUPLICATE_NEW_PASSWORD = "BAD_REQUEST_DUPLICATE_NEW_PASSWORD",
}
