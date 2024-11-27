import { Role } from '@prisma/client';

export class ActiveUserData {
    // sub is subject of the token, which is unique for each user
    sub: number;
    email: string;
    role: Role;
    refreshTokenId: string;
}
