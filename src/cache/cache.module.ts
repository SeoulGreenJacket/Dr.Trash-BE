import { Module, OnApplicationShutdown } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { createClient } from 'redis';
import { CacheService } from './cache.service';

@Module({
  providers: [
    CacheService,
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        const { REDIS_HOST: host, REDIS_PORT: port } = process.env;
        return createClient({ url: `redis://${host}:${port}` });
      },
    },
  ],
})
export class CacheModule implements OnApplicationShutdown {
  constructor(private readonly moduleRef: ModuleRef) {}

  onApplicationBootstrap() {
    this.moduleRef.get('REDIS_CLIENT').connect();
  }

  onApplicationShutdown() {
    this.moduleRef.get('REDIS_CLIENT').end();
  }
}
