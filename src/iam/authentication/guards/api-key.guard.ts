import {
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
    Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiKeysService } from '../api-keys.service';
import { DatabaseService } from '../../../database/database.service';
import { REQUEST_USER_KEY } from '../../constants/iam.constant';
import { ActiveUserData } from '../../interfaces/active-user-data.interface';

@Injectable()
export class ApiKeyGuard implements CanActivate {
    constructor(
        private readonly apiKeyService: ApiKeysService,
        private readonly databaseService: DatabaseService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const bufferedApiKey = this.extractApiKeyFromHeader(request);
        if (!bufferedApiKey) {
            throw new UnauthorizedException(
                'Unauthorized from ApiKeyGuard at extractApiKeyFromHeader()',
            );
        }

        const id =
            this.apiKeyService.extractIdFromBufferedApiKey(bufferedApiKey);
        try {
            const hashedApiKey = await this.databaseService.apiKey.findUnique({
                where: { uuid: id },
                include: { user: true },
            });
            await this.apiKeyService.validate(bufferedApiKey, hashedApiKey.key);
            request[REQUEST_USER_KEY] = {
                sub: hashedApiKey.user.id,
                email: hashedApiKey.user.email,
                role: hashedApiKey.user.role,
                permissions: hashedApiKey.user.permissions,
            } as ActiveUserData;
        } catch {
            throw new UnauthorizedException(
                'Unauthorized from ApiKeyGuard at validate()',
            );
        }
        return true;
    }

    // apiKey here is the base64 encoded string that contains the id and the randomUUID value
    private extractApiKeyFromHeader(request: Request): string | undefined {
        const [type, bufferedApiKey] =
            request.headers.authorization?.split(' ') ?? [];
        return type === 'ApiKey' ? bufferedApiKey : undefined;
    }
}
