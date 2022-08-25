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
        const client = createClient({ url: `redis://${host}:${port}` });
        client.connect();
        return client;
      },
    },
  ],
})
export class CacheModule implements OnApplicationShutdown {
  constructor(private readonly moduleRef: ModuleRef) {}

  onApplicationShutdown() {
    this.moduleRef.get('REDIS_CLIENT').end();
  }
}
