import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AccessTokenGuard } from './access-token.guard';
import { AuthType } from '../enums/auth-type.enum';
import { AUTH_TYPE_KEY } from '../decorators/auth.decorator';

@Injectable()
export class AuthenticationGuard implements CanActivate {
    // static: default strategy
    private static readonly defaultAuthType = AuthType.Bearer;

    // none-static: mappings between auth types and actual corresponding guards
    private readonly authTypeGuardMap: Record<
        AuthType,
        CanActivate | CanActivate[]
    > = {
        // if the auth type is Bearer, use the access token guard
        [AuthType.Bearer]: this.accessTokenGuard,
        // if the auth type is None, skip authentication
        [AuthType.None]: { canActivate: () => true },
    };

    constructor(
        // access to the underlying metadata (request)
        private readonly reflector: Reflector,
        private readonly accessTokenGuard: AccessTokenGuard,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        // get all auth types from the metadata (request)
        const authTypes = this.reflector.getAllAndOverride<AuthType[]>(
            AUTH_TYPE_KEY,
            [context.getHandler(), context.getClass()],
            // use the default auth type if not found in the metadata (request)
        ) ?? [AuthenticationGuard.defaultAuthType];

        // get all guards for the specified auth types
        const guardObjects = authTypes
            .map((type) => this.authTypeGuardMap[type])
            .flat();

        let error = new UnauthorizedException('Custom Unauthorized');

        // loop through all guards to check if any of them can activate
        for (const guardObject of guardObjects) {
            // if the guard can activate, return true (allow access)
            const canActivate = await Promise.resolve(
                guardObject.canActivate(context),
            ).catch((err) => {
                error = err;
            });

            if (canActivate) {
                return true;
            }
        }

        throw error;
    }
}
