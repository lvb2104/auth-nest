import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class CoffinsService {
    create(createCoffinDto: Prisma.CoffinCreateInput) {
        return 'This action adds a new coffin';
    }

    findAll() {
        return `This action returns all coffins`;
    }

    findOne(id: number) {
        return `This action returns a #${id} coffin`;
    }

    update(id: number, updateCoffinDto: Prisma.CoffinUpdateInput) {
        return `This action updates a #${id} coffin`;
    }

    remove(id: number) {
        return `This action removes a #${id} coffin`;
    }
}
