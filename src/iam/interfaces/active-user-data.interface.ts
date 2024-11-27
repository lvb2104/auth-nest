import { Permission, Role } from '@prisma/client';

// ActiveUserData used to store the user data in the request object
export class ActiveUserData {
    sub?: number;
    email?: string;
    role?: Role;
    permissions?: Permission[];
    refreshTokenId?: string;
}
