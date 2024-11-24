import { Module } from '@nestjs/common';
import { HashingService } from './hashing/hashing.service';
import { BcryptService } from './hashing/bcrypt.service';
import { AuthenticationController } from './authentication/authentication.controller';
import { AuthenticationService } from './authentication/authentication.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
    imports: [DatabaseModule],
    providers: [
        {
            provide: HashingService,
            useClass: BcryptService,
        },
        AuthenticationService,
    ],
    controllers: [AuthenticationController],
})
export class IamModule {}
