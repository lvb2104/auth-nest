import {
    Injectable,
    OnApplicationBootstrap,
    OnApplicationShutdown,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';
import { InvalidatedRefreshTokenError } from '../common/errors/invalidated-refresh-token-error.error';

@Injectable()
export class RedisService
    implements OnApplicationBootstrap, OnApplicationShutdown
{
    private redisClient: any;
    constructor(private readonly configService: ConfigService) {}

    async onApplicationBootstrap() {
        this.redisClient = createClient({
            password: this.configService.getOrThrow('REDIS_PASSWORD'),
            socket: {
                host: this.configService.getOrThrow('REDIS_HOST'),
                port: this.configService.getOrThrow('REDIS_PORT'),
            },
        });

        this.redisClient.on('error', (err: any) =>
            console.error('Redis Client Error', err),
        );

        await this.redisClient.connect();
    }

    async onApplicationShutdown() {
        await this.redisClient.quit();
    }

    // insert new entries into the cache
    async insert(userId: number, tokenId: string): Promise<void> {
        await this.redisClient.set(this.getKey(userId), tokenId);
    }

    // validate the token id passed in
    async validate(userId: number, tokenId: string): Promise<boolean> {
        const storeId = await this.redisClient.get(this.getKey(userId));
        if (storeId !== tokenId) {
            throw new InvalidatedRefreshTokenError();
        }
        return storeId === tokenId;
    }

    // invalidate the token id by removing it from the cache
    async invalidate(userId: number): Promise<void> {
        await this.redisClient.del(this.getKey(userId));
    }

    // the entry id based on the user id
    private getKey(userId: number): string {
        return `user-${userId}`;
    }
}
