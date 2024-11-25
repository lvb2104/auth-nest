import { Module } from '@nestjs/common';
import { CoffinsService } from './coffins.service';
import { CoffinsController } from './coffins.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
    imports: [DatabaseModule],
    controllers: [CoffinsController],
    providers: [CoffinsService],
})
export class CoffinsModule {}
