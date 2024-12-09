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
import { Roles } from '../iam/authorization/decorators/roles.decorator';
import { Permission, Prisma, Role } from '@prisma/client';
import { ActiveUser } from '../iam/decorators/active-user.decorator';
import { ActiveUserData } from '../iam/interfaces/active-user-data.interface';
import { Permissions } from '../iam/authorization/decorators/permission.decorator';
import { Auth } from '../iam/authentication/decorators/auth.decorator';
import { AuthType } from '../iam/authentication/enums/auth-type.enum';

@Auth(AuthType.Bearer, AuthType.ApiKey)
@Controller('coffins')
export class CoffinsController {
    constructor(private readonly coffinsService: CoffinsService) {}

    // @Roles(Role.Admin)
    @Permissions(Permission.CreateCoffin)
    @Post()
    create(@Body() createCoffinDto: Prisma.CoffinCreateInput) {
        return this.coffinsService.create(createCoffinDto);
    }

    @Get()
    findAll(@ActiveUser() user: ActiveUserData) {
        return this.coffinsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.coffinsService.findOne(+id);
    }

    // @Roles(Role.Admin)
    @Permissions(Permission.UpdateCoffin)
    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateCoffinDto: Prisma.CoffinUpdateInput,
    ) {
        return this.coffinsService.update(+id, updateCoffinDto);
    }

    @Roles(Role.Admin)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.coffinsService.remove(+id);
    }
}
