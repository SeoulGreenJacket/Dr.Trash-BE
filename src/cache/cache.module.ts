import { UsersModule } from 'src/users/users.module';
import { UsersRepository } from 'src/users/users.repository';
import { AchievementsModule } from 'src/achievements/achievements.module';
import { Module, OnApplicationShutdown, forwardRef } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { createClient } from 'redis';
import { redis } from 'src/common/environments';
import { DatabaseModule } from 'src/database/database.module';
import { CacheService } from './cache.service';

@Module({
  imports: [
    DatabaseModule,
    forwardRef(() => {
      return AchievementsModule;
    }),
    forwardRef(() => {
      return UsersModule;
    }),
  ],
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
    private readonly usersRepository: UsersRepository,
  ) {}

  async onApplicationBootstrap() {
    await this.moduleRef.get('REDIS_CLIENT').connect();
    await this.usersRepository.resetUserPoint();
    await this.cacheService.flushAll();
    await this.cacheService.migrateUsersPoint();
    await this.cacheService.migrateUsersAllTrash();
    await this.cacheService.migrateUsersUsageTrialTrash();
  }

  onApplicationShutdown() {
    this.moduleRef.get('REDIS_CLIENT').end();
  }
}
