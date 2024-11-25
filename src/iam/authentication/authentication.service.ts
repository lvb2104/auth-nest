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

        // generate a new jwt
        const accessToken = await this.jwtService.signAsync(
            // payload
            {
                sub: user.id, // consistent with jwt-standards
                email: user.email, // optional naming
            } as ActiveUserData,
            // jwt-configuration
            {
                secret: this.jwtConfiguration.secret,
                audience: this.jwtConfiguration.audience,
                issuer: this.jwtConfiguration.issuer,
                expiresIn: this.jwtConfiguration.accessTokenTtl,
            },
        );

        return {
            accessToken,
        };
    }
}
