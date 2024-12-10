import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ActiveUserData } from '../../interfaces/active-user-data.interface';
import { REQUEST_USER_KEY } from '../../constants/iam.constant';
import { PERMISSONS_KEY } from '../decorators/permission.decorator';
import { Permission } from '@prisma/client';

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const contextPermissions = this.reflector.getAllAndOverride<
            Permission[]
        >(PERMISSONS_KEY, [context.getHandler(), context.getClass()]);

        if (!contextPermissions) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user: ActiveUserData = request[REQUEST_USER_KEY];
        return contextPermissions.every((permission) => {
            return user.permissions?.includes(permission);
        });
    }
}
