import { SetMetadata } from '@nestjs/common';
import { Permission } from '@prisma/client';

export const PERMISSONS_KEY = 'permission';

export const Permissions = (...permissions: Permission[]) => {
    return SetMetadata(PERMISSONS_KEY, permissions);
};
