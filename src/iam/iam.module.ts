import { Module } from '@nestjs/common';
import { HashingService } from './hashing/hashing.service';
import { BcryptService } from './hashing/bcrypt.service';
import { AuthenticationController } from './authentication/authentication.controller';
import { AuthenticationService } from './authentication/authentication.service';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from './config/jwt.config';
import { DatabaseModule } from '../database/database.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthenticationGuard } from './authentication/guards/authentication.guard';
import { AccessTokenGuard } from './authentication/guards/access-token.guard';
import { RedisService } from '../cache/redis.service';
import { PermissionsGuard } from './authorization/guards/permissions.guard';
import { ApiKeysService } from './authentication/api-keys.service';
import { ApiKeyGuard } from './authentication/guards/api-key.guard';
import { RolesGuard } from './authorization/guards/roles.guard';

@Module({
    imports: [
        JwtModule.registerAsync(jwtConfig.asProvider()),
        DatabaseModule,
        ConfigModule.forFeature(jwtConfig),
        // use partial registration
    ],
    providers: [
        {
            provide: HashingService,
            // can be BcryptService or any other service that implements HashingService
            useClass: BcryptService,
        },
        // guards
        {
            provide: APP_GUARD,
            useClass: AuthenticationGuard,
        },
        {
            provide: APP_GUARD,
            useClass: RolesGuard,
        },
        {
            provide: APP_GUARD,
            useClass: PermissionsGuard,
        },
        {
            provide: APP_GUARD,
            useClass: ApiKeyGuard,
        },
        AuthenticationService,
        AccessTokenGuard,
        ApiKeyGuard,
        RedisService,
        ApiKeysService,
    ],
    controllers: [AuthenticationController],
})
export class IamModule {}
