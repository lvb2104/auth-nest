import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ActiveUser } from '../iam/decorators/active-user.decorator';
import { ActiveUserData } from '../iam/interfaces/active-user-data.interface';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    @Get()
    // @ActiveUser() decorator is used to get decoded user payload instead of using @Req() decorator
    findAll(@ActiveUser() user: ActiveUserData) {
        console.log(user);
        return this.usersService.findAll();
    }

    @Get(':id')
    findOne(@Param() id: string) {
        return this.usersService.findOne(+id);
    }

    @Patch(':id')
    update(@Param() id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(+id, updateUserDto);
    }

    @Delete(':id')
    remove(@Param() id: string) {
        return this.usersService.remove(+id);
    }
}
