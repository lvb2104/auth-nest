import { Optional } from '@nestjs/common';
import { IsEmail, MinLength } from 'class-validator';

export class SignInDto {
    @IsEmail()
    email: string;

    @MinLength(8)
    password: string;

    @Optional()
    tfaCode: string;
}
