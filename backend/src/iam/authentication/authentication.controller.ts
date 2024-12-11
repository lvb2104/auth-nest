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
import { Auth } from './decorators/auth.decorator';
import { AuthType } from './enums/auth-type.enum';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ActiveUser } from '../decorators/active-user.decorator';
import { ActiveUserData } from '../interfaces/active-user-data.interface';
import { OtpAuthenticationService } from './otp-authentication.service';
import { Response } from 'express';
import { toFileStream } from 'qrcode';

// set metadata for skipping authentication
@Auth(AuthType.None)
@Controller('authentication')
export class AuthenticationController {
    constructor(
        private readonly authenticationService: AuthenticationService,
        private readonly otpAuthenticationService: OtpAuthenticationService,
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

    @HttpCode(HttpStatus.OK)
    @Post('refresh-tokens')
    refreshTokens(@Body() refreshToken: RefreshTokenDto) {
        return this.authenticationService.refreshTokens(refreshToken);
    }

    @Auth(AuthType.Bearer)
    @HttpCode(HttpStatus.OK)
    @Post('2fa/generate')
    async generateQrCode(
        @ActiveUser() user: ActiveUserData,
        @Res() response: Response,
    ) {
        // generate a secret key for the user to use for TFA (Time-based One-Time Password)
        const { uri, secret } =
            await this.otpAuthenticationService.generateSecret(user.email);

        // enable TFA for the user by storing the secret in the database and setting isTfaEnabled to true
        await this.otpAuthenticationService.enableTfaForUser(
            user.email,
            secret,
        );

        // set the response content type to image/png as we are going to stream a QR code image to the client
        response.type('png');
        // generate a QR code as image and stream it directly to the HTTP response containing the URI
        return toFileStream(response, uri);
    }
}
