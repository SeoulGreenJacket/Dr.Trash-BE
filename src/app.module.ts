import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { CacheModule } from './cache/cache.module';
import { TrashcansModule } from './trashcans/trashcans.module';
import { TrashModule } from './trash/trash.module';
import { AchievementsModule } from './achievements/achievements.module';
import { AchievementInterceptor } from './achievements/achievement.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    AuthModule,
    CacheModule,
    DatabaseModule,
    UsersModule,
    TrashcansModule,
    TrashModule,
    AchievementsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.development.env',
    }),
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: AchievementInterceptor,
    },
  ],
})
export class AppModule {}
