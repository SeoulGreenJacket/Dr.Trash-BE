import { AchievementsModule } from 'src/achievements/achievements.module';
import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthModule } from './../auth/auth.module';
import { DatabaseModule } from './../database/database.module';
import { UsersRepository } from './users.repository';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => AchievementsModule),
    DatabaseModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
