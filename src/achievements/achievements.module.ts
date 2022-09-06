import { Module, forwardRef } from '@nestjs/common';
import { AchievementsService } from './achievements.service';
import { AchievementsController } from './achievements.controller';
import { CacheModule } from 'src/cache/cache.module';
import { DatabaseModule } from 'src/database/database.module';
import { AchievementsRepository } from './achievements.repository';

@Module({
  imports: [
    forwardRef(() => {
      return CacheModule;
    }),
    DatabaseModule,
  ],
  controllers: [AchievementsController],
  providers: [AchievementsService, AchievementsRepository],
  exports: [AchievementsRepository],
})
export class AchievementsModule {}
