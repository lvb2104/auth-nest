import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';

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
    signIn(@Body() signInDto: SignInDto) {
        return this.authenticationService.signIn(signInDto);
    }
}
