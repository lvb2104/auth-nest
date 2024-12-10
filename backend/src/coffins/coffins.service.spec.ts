import { Test, TestingModule } from '@nestjs/testing';
import { CoffinsService } from './coffins.service';

describe('CoffinsService', () => {
    let service: CoffinsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [CoffinsService],
        }).compile();

        service = module.get<CoffinsService>(CoffinsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
