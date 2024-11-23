import { Test, TestingModule } from '@nestjs/testing';
import { CoffinsController } from './coffins.controller';
import { CoffinsService } from './coffins.service';

describe('CoffinsController', () => {
    let controller: CoffinsController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [CoffinsController],
            providers: [CoffinsService],
        }).compile();

        controller = module.get<CoffinsController>(CoffinsController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
