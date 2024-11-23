import { Injectable } from '@nestjs/common';
import { CreateCoffinDto } from './dto/create-coffin.dto';
import { UpdateCoffinDto } from './dto/update-coffin.dto';

@Injectable()
export class CoffinsService {
    create(createCoffinDto: CreateCoffinDto) {
        return 'This action adds a new coffin';
    }

    findAll() {
        return `This action returns all coffins`;
    }

    findOne(id: number) {
        return `This action returns a #${id} coffin`;
    }

    update(id: number, updateCoffinDto: UpdateCoffinDto) {
        return `This action updates a #${id} coffin`;
    }

    remove(id: number) {
        return `This action removes a #${id} coffin`;
    }
}
