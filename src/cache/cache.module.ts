import { Module, OnApplicationShutdown } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { createClient } from 'redis';
import { DatabaseModule } from 'src/database/database.module';
import { CacheService } from './cache.service';

@Module({
  imports: [DatabaseModule],
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
  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly cacheService: CacheService,
  ) {}

  async onApplicationBootstrap() {
    await this.moduleRef.get('REDIS_CLIENT').connect();
    this.cacheService.migrateUsersPoint();
    this.cacheService.migrateUsersTrash();
  }

  onApplicationShutdown() {
    this.moduleRef.get('REDIS_CLIENT').end();
  }
}
