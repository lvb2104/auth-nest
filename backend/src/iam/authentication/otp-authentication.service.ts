import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../../database/database.service';
import { authenticator } from 'otplib';

@Injectable()
export class OtpAuthenticationService {
    constructor(
        private readonly configService: ConfigService,
        private readonly databaseService: DatabaseService,
    ) {}

    // each user must have a unique secret key
    async generateSecret(email: string) {
        // generate a secret key for the user to use for TFA (Time-based One-Time Password)
        const secret = authenticator.generateSecret();

        const appName = this.configService.getOrThrow('TFA_APP_NAME');

        // generate URI to be used for QR code generation
        // URI is a string that can be used to generate a QR code for the user to scan and add the secret key to their authenticator app (e.g. Google Authenticator)
        // URI is matched with the secret key to generate the TFA code
        const uri = authenticator.keyuri(email, appName, secret);
        return {
            uri,
            secret,
        };
    }

    verifyCode(code: string, secret: string) {
        // verify the code using the secret key generated for the user and the code provided by the user
        return authenticator.verify({
            token: code,
            secret,
        });
    }

    async enableTfaForUser(email: string, secret: string) {
        // find the user by email
        const { id } = await this.databaseService.user.findUniqueOrThrow({
            where: { email },
            select: { id: true },
        });

        // update the user with the secret and enable TFA
        await this.databaseService.user.update({
            where: { id },
            // Ideally, we would want to encrypt the "secret" instead of storing it in a plaintext.
            // Note - we couldn't use hashing here as the original secret is require to verify the user's provided code
            data: { tfaSecret: secret, isTfaEnabled: true },
        });
    }
}
