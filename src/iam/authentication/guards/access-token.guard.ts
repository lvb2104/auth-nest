import {
    CanActivate,
    ExecutionContext,
    Inject,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { REQUEST_USER_KEY } from '../../iam.constants';
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
            throw new UnauthorizedException();
        }

        try {
            // payload is the decoded token value
            const payload = await this.jwtService.verifyAsync(
                token,
                this.jwtConfiguration,
            );
            request[REQUEST_USER_KEY] = payload;
        } catch {
            throw new UnauthorizedException();
        }
        return true;
    }

    // The header might look like 'Authorization: Bearer some-token-value'
    private extractTokenFromHeader(request: Request): string | undefined {
        const [_, token] = request.headers.authorization?.split(' ') ?? [];
        return token;
    }
}