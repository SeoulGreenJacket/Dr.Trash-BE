import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { CacheModule } from './cache/cache.module';
import { TrashcansModule } from './trashcans/trashcans.module';
import { TrashModule } from './trash/trash.module';

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
    TrashcansModule,
    TrashModule,
  ],
})
export class AppModule {}
