import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { CacheModule } from './cache/cache.module';
import { AchievementsModule } from './achievements/achievements.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AchievementInterceptor } from './achievements/achievement.interceptor';

@Module({
  imports: [
    AuthModule,
    CacheModule,
    DatabaseModule,
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.development.env',
    }),
    AchievementsModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: AchievementInterceptor,
    },
  ],
})
export class AppModule {}
