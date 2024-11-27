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
import { Permission, Role } from '@prisma/client';
import { ActiveUser } from '../iam/decorators/active-user.decorator';
import { ActiveUserData } from '../iam/interfaces/active-user-data.interface';
import { Permissions } from '../iam/authorization/decorators/permission.decorator';

@Controller('coffins')
export class CoffinsController {
    constructor(private readonly coffinsService: CoffinsService) {}

    // @Roles(Role.Admin)
    @Permissions(Permission.CreateCoffin)
    @Post()
    create(@Body() createCoffinDto: CreateCoffinDto) {
        return this.coffinsService.create(createCoffinDto);
    }

    @Get()
    findAll(@ActiveUser() user: ActiveUserData) {
        console.log(user);
        return this.coffinsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.coffinsService.findOne(+id);
    }

    @Permissions(Permission.UpdateCoffin)
    // @Roles(Role.Admin)
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
