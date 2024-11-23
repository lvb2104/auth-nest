import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { CoffinsService } from './coffins.service';
import { CreateCoffinDto } from './dto/create-coffin.dto';
import { UpdateCoffinDto } from './dto/update-coffin.dto';

@Controller('coffins')
export class CoffinsController {
    constructor(private readonly coffinsService: CoffinsService) {}

    @Post()
    create(@Body() createCoffinDto: CreateCoffinDto) {
        return this.coffinsService.create(createCoffinDto);
    }

    @Get()
    findAll() {
        return this.coffinsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.coffinsService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateCoffinDto: UpdateCoffinDto) {
        return this.coffinsService.update(+id, updateCoffinDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.coffinsService.remove(+id);
    }
}
