import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { Auth } from './decorators/auth.decorator';
import { AuthType } from './enums/auth-type.enum';

@Auth(AuthType.None)
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
    signIn(
        // @Res({ passthrough: true }) response: Response,
        @Body() signInDto: SignInDto,
    ) {
        return this.authenticationService.signIn(signInDto);
        // response.cookie('accessToken', accessToken, {
        // secure means that the cookie will only be sent over HTTPS connections (recommended in production)
        // secure: true,
        // httpOnly means that the cookie cannot be accessed by client-side scripts (recommended)
        // httpOnly: true,
        // sameSite means that the cookie will only be sent in a first-party context (recommended)
        // sameSite: true,
        // });
    }
}
