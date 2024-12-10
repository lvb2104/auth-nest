import { Injectable, Type } from '@nestjs/common';
import { Policy } from './interfaces/policy.interface';
import { PolicyHandler } from './interfaces/policy-handler.interface';

@Injectable()
export class PolicyHandlerStorage {
    private readonly collection = new Map<Type<Policy>, PolicyHandler<any>>();
}
