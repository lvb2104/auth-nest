import { $Enums, Prisma } from '@prisma/client';

export class User implements Prisma.UserCreateInput {
    id: number;
    email: string;
    password: string;
    role?: $Enums.Role;
}
