import { Module, OnApplicationShutdown } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { createClient } from 'redis';
import { redis } from 'src/common/environments';
import { DatabaseModule } from 'src/database/database.module';
import { CacheService } from './cache.service';

@Module({
  imports: [DatabaseModule],
  providers: [
    CacheService,
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        return createClient(redis.config);
      },
    },
  ],
  exports: [CacheService],
})
export class CacheModule implements OnApplicationShutdown {
  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly cacheService: CacheService,
  ) {}

  async onApplicationBootstrap() {
    await this.moduleRef.get('REDIS_CLIENT').connect();
    await this.cacheService.migrateUsersPoint();
    await this.cacheService.migrateUsersAllTrash();
    await this.cacheService.migrateUsersUsageTrialTrash();
  }

  onApplicationShutdown() {
    this.moduleRef.get('REDIS_CLIENT').end();
  }
}
