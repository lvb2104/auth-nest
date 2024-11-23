import { Module } from '@nestjs/common';
import { CoffinsService } from './coffins.service';
import { CoffinsController } from './coffins.controller';

@Module({
    controllers: [CoffinsController],
    providers: [CoffinsService],
})
export class CoffinsModule {}
