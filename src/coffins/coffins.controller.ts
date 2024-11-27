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
import { Roles } from '../iam/authorization/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('coffins')
export class CoffinsController {
    constructor(private readonly coffinsService: CoffinsService) {}

    @Roles(Role.Admin)
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

    @Roles(Role.Admin)
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateCoffinDto: UpdateCoffinDto) {
        return this.coffinsService.update(+id, updateCoffinDto);
    }

    @Roles(Role.Admin)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.coffinsService.remove(+id);
    }
}
