import { SetMetadata } from '@nestjs/common';
import { AuthType } from '../enums/auth-type.enum';

// metadata key
export const AUTH_TYPE_KEY = 'authType';

// decorator factory function that adds metadata to the handler (method) or the class (controller) with the specified auth types (default is Bearer) to be used by the authentication guard to determine the authentication strategy to use for the handler (method) or the class (controller)
export const Auth = (...authTypes: AuthType[]) => {
    return SetMetadata(AUTH_TYPE_KEY, authTypes);
};
