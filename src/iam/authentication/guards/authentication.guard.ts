import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { AccessTokenGuard } from './access-token.guard';
import { AuthType } from '../enums/auth-type.enum';

@Injectable()
export class AuthenticationGuard implements CanActivate {
    private static readonly defaultAuthType = AuthType.Bearer;
    private readonly authTypeGuardMap: Record<
        AuthType,
        CanActivate | CanActivate[]
    > = {
        [AuthType.Bearer]: this.accessTokenGuard,
        [AuthType.None]: { canActivate: () => true },
    };

    constructor(
        private readonly reflector: Reflector,
        private readonly accessTokenGuard: AccessTokenGuard,
    ) {}

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        return true;
    }
}
