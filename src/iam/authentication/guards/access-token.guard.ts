import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Inject,
    Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { REQUEST_USER_KEY } from '../../constants/iam.constant';
import { Request } from 'express';

@Injectable()
export class AccessTokenGuard implements CanActivate {
    constructor(
        // use jwtService to decode incoming JWT tokens
        private readonly jwtService: JwtService,
        // pass secret key to decode method
        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new ForbiddenException('Forbidden from AccessTokenGuard');
        }

        try {
            // payload is the decoded object from the JWT token passed in
            const payload = await this.jwtService.verifyAsync(
                token,
                this.jwtConfiguration,
            );
            // 💡 We're assigning the payload to the request object here
            // so that we can access it in our route handlers
            request[REQUEST_USER_KEY] = payload;
        } catch {
            throw new ForbiddenException('Forbidden from AccessTokenGuard');
        }
        return true;
    }

    // The header might look like 'Authorization: Bearer some-token-value'
    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
