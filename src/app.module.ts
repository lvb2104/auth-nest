import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { CoffinsModule } from './coffins/coffins.module';
import { IamModule } from './iam/iam.module';

@Module({
    imports: [UsersModule, CoffinsModule, IamModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
