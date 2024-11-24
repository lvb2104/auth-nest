import { Module } from '@nestjs/common';
import { HashingService } from './hashing/hashing.service';
import { BcryptService } from './hashing/bcrypt.service';
import { AuthenticationController } from './authentication/authentication.controller';
import { AuthenticationService } from './authentication/authentication.service';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from './config/jwt.config';
import { DatabaseModule } from '../database/database.module';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        DatabaseModule,
        JwtModule.registerAsync(jwtConfig.asProvider()),
        // use partial registration
        ConfigModule.forFeature(jwtConfig),
    ],
    providers: [
        {
            provide: HashingService,
            // can be BcryptService or any other service that implements HashingService
            useClass: BcryptService,
        },
        AuthenticationService,
    ],
    controllers: [AuthenticationController],
})
export class IamModule {}
