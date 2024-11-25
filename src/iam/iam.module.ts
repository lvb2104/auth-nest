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
        {
            provide: APP_GUARD,
            useClass: AuthenticationGuard,
        },
        AuthenticationService,
        AccessTokenGuard,
    ],
    controllers: [AuthenticationController],
})
export class IamModule {}
