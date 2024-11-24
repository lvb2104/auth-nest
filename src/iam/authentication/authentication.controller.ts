import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    Res,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { Response } from 'express';

@Controller('authentication')
export class AuthenticationController {
    constructor(
        private readonly authenticationService: AuthenticationService,
    ) {}

    @Post('sign-up')
    signUp(@Body() signUpDto: SignUpDto) {
        return this.authenticationService.signUp(signUpDto);
    }

    // using 200 OK status code instead of 201 Created status code (default for POST)
    @HttpCode(HttpStatus.OK)
    @Post('sign-in')
    async signIn(
        @Res({ passthrough: true }) response: Response,
        @Body() signInDto: SignInDto,
    ) {
        const accessToken = await this.authenticationService.signIn(signInDto);
        response.cookie('accessToken', accessToken, {
            // secure means that the cookie will only be sent over HTTPS connections (recommended in production)
            secure: true,
            // httpOnly means that the cookie cannot be accessed by client-side scripts (recommended)
            httpOnly: true,
            // sameSite means that the cookie will only be sent in a first-party context (recommended)
            sameSite: true,
        });
    }
}
