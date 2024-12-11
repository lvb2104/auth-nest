import {
    ConflictException,
    Injectable,
    OnModuleInit,
    UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { DatabaseService } from '../../../database/database.service';
import { AuthenticationService } from '../authentication.service';

@Injectable()
export class GoogleAuthenticationService implements OnModuleInit {
    private oauthClient: OAuth2Client;

    constructor(
        private readonly configService: ConfigService,
        private readonly databaseService: DatabaseService,
        private readonly authenticationService: AuthenticationService,
    ) {}

    onModuleInit() {
        const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
        const clientSecret = this.configService.get<string>(
            'GOOGLE_CLIENT_SECRET',
        );
        this.oauthClient = new OAuth2Client(clientId, clientSecret);
    }

    // token is the token received from Google OAuth service after successful authentication with Google account (e.g. Google Sign-In) by the client application (e.g. frontend) using Google Sign-In SDK (e.g. Google Sign-In for Websites)
    async authenticate(token: string) {
        try {
            // verify the token with Google
            const loginTicket = await this.oauthClient.verifyIdToken({
                idToken: token,
                audience: this.configService.get<string>('GOOGLE_CLIENT_ID'),
            });
            const { email, sub: googleId } = loginTicket.getPayload();
            const user = await this.databaseService.user.findFirst({
                where: {
                    googleId,
                },
            });
            // create new account here
            if (user) {
                return this.authenticationService.generateTokens(user);
            }
            // if do not exist, create a new account and return a pair of tokens to client
            const newUser = await this.databaseService.user.create({
                data: { email, googleId },
            });
            return this.authenticationService.generateTokens(newUser);
        } catch (error) {
            const pgUniqueViolation = '23505';
            if (error.code === pgUniqueViolation) {
                throw new ConflictException(
                    'Email already exists from Google authentication service',
                );
            }
            throw new UnauthorizedException(
                'Invalid token from Google authentication service',
            );
        }
    }
}
