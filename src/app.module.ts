import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { CoffinsModule } from './coffins/coffins.module';
import { IamModule } from './iam/iam.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import * as Joi from '@hapi/joi';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: Joi.object({
                DATABASE_URL: Joi.string().required(),
                JWT_SECRET: Joi.string().required(),
                JWT_TOKEN_AUDIENCE: Joi.string().default('localhost:3000'),
                JWT_TOKEN_ISSUER: Joi.string().default('localhost:3000'),
                JWT_ACCESS_TOKEN_TTL: Joi.string().default('3600'),
                JWT_REFRESH_TOKEN_TTL: Joi.string().default('86400'),
            }),
        }),
        DatabaseModule,
        UsersModule,
        CoffinsModule,
        IamModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
