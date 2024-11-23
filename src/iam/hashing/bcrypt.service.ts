import { Injectable } from '@nestjs/common';
import { HashingService } from './hashing.service';
import { compare, genSalt, hash } from 'bcrypt';

@Injectable()
export class BcryptService implements HashingService {
    // implement hash method to hash data and return the hashed data as a string
    async hash(data: string | Buffer): Promise<string> {
        const salt = await genSalt();
        return hash(data, salt);
    }

    // implement compare method to compare data with encrypted data
    compare(data: string | Buffer, encrypted: string): Promise<boolean> {
        return compare(data, encrypted);
    }
}
