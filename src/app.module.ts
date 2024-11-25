import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { CoffinsModule } from './coffins/coffins.module';
import { IamModule } from './iam/iam.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
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
