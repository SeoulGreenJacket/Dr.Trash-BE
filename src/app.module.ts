import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { TrashcansModule } from './trashcans/trashcans.module';
import { TrashModule } from './trash/trash.module';
import { AchievementsModule } from './achievements/achievements.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AchievementInterceptor } from './achievements/achievement.interceptor';
import { ArticlesModule } from './articles/articles.module';
import { KafkaModule } from './kafka/kafka.module';

@Module({
  imports: [
    AuthModule,
    DatabaseModule,
    UsersModule,
    AchievementsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TrashcansModule,
    TrashModule,
    ArticlesModule,
    KafkaModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: AchievementInterceptor,
    },
  ],
})
export class AppModule {}
