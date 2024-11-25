import {
    ConflictException,
    Inject,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { HashingService } from '../hashing/hashing.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { Prisma } from '@prisma/client';
import { DatabaseService } from '../../database/database.service';
import { User } from '../../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { ActiveUserData } from '../interfaces/active-user-data.interface';
import { RefreshToken } from './dto/refresh-token.dto';

@Injectable()
export class AuthenticationService {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly hashingService: HashingService,
        private readonly jwtService: JwtService,

        // inject jwtConfig
        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    ) {}

    async signUp(signUpDto: SignUpDto) {
        try {
            const user = new User();
            user.email = signUpDto.email;
            user.password = await this.hashingService.hash(signUpDto.password);
            await this.databaseService.user.create({ data: user });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ConflictException();
                }
            }
        }
    }

    async signIn(signInDto: SignInDto) {
        const user = await this.databaseService.user.findUnique({
            where: {
                email: signInDto.email,
            },
        });

        if (!user) {
            throw new UnauthorizedException('User does not exist');
        }

        const isMatch = await this.hashingService.compare(
            signInDto.password,
            user.password,
        );

        if (!isMatch) {
            throw new UnauthorizedException('Password does not match');
        }

        // generate tokens after verifying the user's credentials
        return await this.generateTokens(user);
    }

    async generateTokens(user: User) {
        // use Promise.all to enhance performance
        const [accessToken, refreshToken] = await Promise.all([
            this.signToken<Partial<ActiveUserData>>(
                user.id,
                this.jwtConfiguration.accessTokenTtl,
                { email: user.email },
            ),
            this.signToken(user.id, this.jwtConfiguration.refreshTokenTtl, {
                email: user.email,
            }),
        ]);

        // send the tokens back to the client
        return {
            accessToken,
            refreshToken,
        };
    }

    async refreshTokens(refreshToken: RefreshToken) {
        // exception user does not exist or invalid refresh token
        try {
            // verify the refresh token and get the sub (userId) from it to generate a new access token and refresh token
            const { sub } = await this.jwtService.verifyAsync<
                Pick<ActiveUserData, 'sub'>
            >(refreshToken.refreshToken, this.jwtConfiguration);
            const user = await this.databaseService.user.findUniqueOrThrow({
                where: {
                    id: sub,
                },
            });

            // re-generate tokens after verifying the refresh token
            return await this.generateTokens(user);
        } catch {
            throw new UnauthorizedException();
        }
    }

    // refactor signToken to use for both accessToken and refreshToken
    private async signToken<T>(userId: number, expiresIn: number, payload: T) {
        // generate a new jwt
        return await this.jwtService.signAsync(
            // payload
            {
                // use userId to identify the user in the token, remain consistent with jwt-standards
                sub: userId,
                ...payload,
            },
            // jwt-configuration
            {
                secret: this.jwtConfiguration.secret,
                audience: this.jwtConfiguration.audience,
                issuer: this.jwtConfiguration.issuer,
                expiresIn,
            },
        );
    }
}
