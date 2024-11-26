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
import { RedisService } from '../../cache/redis.service';
import { randomUUID } from 'crypto';
import { InvalidatedRefreshTokenError } from '../../common/errors/invalidated-refresh-token-error.error';

@Injectable()
export class AuthenticationService {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly hashingService: HashingService,
        private readonly jwtService: JwtService,

        // inject jwtConfig
        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,

        private readonly redisService: RedisService,
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

    async refreshTokens(refreshToken: RefreshToken) {
        try {
            // verify the refresh token and get the sub (userId) and refreshTokenId from it to verify in cache and generate a new access token and refresh token
            const { sub, refreshTokenId } = await this.jwtService.verifyAsync<
                Pick<ActiveUserData, 'sub'> & { refreshTokenId: string }
            >(refreshToken.refreshToken, this.jwtConfiguration);

            // find the user by userId (sub) to generate new tokens
            const user = await this.databaseService.user.findUniqueOrThrow({
                where: {
                    id: sub,
                },
            });

            // refresh token rotation: check validation of former refresh token
            const isValid = await this.redisService.validate(
                user.id,
                refreshTokenId,
            );

            // revoke former refresh token
            if (isValid) {
                await this.redisService.invalidate(user.id);
            } else {
                throw new Error('Refresh token is invalid');
            }

            // re-generate tokens after verifying the refresh token
            return await this.generateTokens(user);
        } catch (err) {
            if (err instanceof InvalidatedRefreshTokenError) {
                // reuse detection
                throw new UnauthorizedException('Access denied');
            }
            throw new UnauthorizedException();
        }
    }

    async generateTokens(user: User) {
        // generate a random refresh token id to identify the refresh token in the cache
        const refreshTokenId = randomUUID();

        // use Promise.all to enhance performance
        const [accessToken, refreshToken] = await Promise.all([
            // access token
            this.signToken<Partial<ActiveUserData>>(
                user.id,
                this.jwtConfiguration.accessTokenTtl,
                { email: user.email },
            ),
            // refresh token
            this.signToken<Partial<ActiveUserData>>(
                user.id,
                this.jwtConfiguration.refreshTokenTtl,
                { refreshTokenId },
            ),
        ]);

        // insert the refresh token id into the cache
        await this.redisService.insert(user.id, refreshTokenId);

        // send the tokens back to the client
        return {
            accessToken,
            refreshToken,
        };
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
