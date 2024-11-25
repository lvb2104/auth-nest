import { SetMetadata } from '@nestjs/common';
import { AuthType } from '../enums/auth-type.enum';

export const AUTH_TYPE_KEY = 'authType';

// use SetMetadata to define custom decorator for specific route handler
export const Auth = (...authTypes: AuthType[]) => {
    SetMetadata(AUTH_TYPE_KEY, authTypes);
};
