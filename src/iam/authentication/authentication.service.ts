import {
    ConflictException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { HashingService } from '../hashing/hashing.service';
import { DatabaseService } from 'src/database/database.service';
import { SignUpDto } from './dto/sign-up.dto';
import { User } from 'src/users/entities/user.entity';
import { SignInDto } from './dto/sign-in.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuthenticationService {
    constructor(
        private readonly database: DatabaseService,
        private readonly hashingService: HashingService,
    ) {}

    async signUp(signUpDto: SignUpDto) {
        try {
            const user = new User();
            user.email = signUpDto.email;
            user.password = await this.hashingService.hash(signUpDto.password);
            await this.database.user.create({ data: user });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ConflictException();
                }
            }
        }
    }

    async signIn(signInDto: SignInDto) {
        const user = await this.database.user.findUnique({
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

        // TODO: Using JWT in here
        return true;
    }
}
