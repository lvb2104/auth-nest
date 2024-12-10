import { Permission, Role } from '@prisma/client';

export class User {
    id: number;
    email: string;
    password: string;
    role?: Role;
    permissions?: Permission[];
}
