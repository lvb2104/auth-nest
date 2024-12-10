import { Injectable } from '@nestjs/common';
import { HashingService } from '../hashing/hashing.service';
import { randomUUID } from 'crypto';
import { GeneratedApiKeyPayload } from './interfaces/generated-api-key-payload.interface';

@Injectable()
export class ApiKeysService {
    constructor(private readonly hashingService: HashingService) {}

    async createAndHash(id: number): Promise<GeneratedApiKeyPayload> {
        const bufferedApiKey = this.generateApiKey(id);
        const hashedKey = await this.hashingService.hash(bufferedApiKey);
        return {
            bufferedApiKey,
            hashedKey,
        };
    }

    async validate(bufferedApiKey: string, hashKey: string): Promise<boolean> {
        return this.hashingService.compare(bufferedApiKey, hashKey);
    }

    extractIdFromBufferedApiKey(bufferedApiKey: string): string {
        const [id] = Buffer.from(bufferedApiKey, 'base64')
            .toString('ascii')
            .split(' ');
        return id;
    }

    private generateApiKey(id: number): string {
        const apiKey = `${id} ${randomUUID()}`;
        return Buffer.from(apiKey).toString('base64');
    }
}
