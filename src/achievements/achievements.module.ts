import { Module, forwardRef } from '@nestjs/common';
import { AchievementsService } from './achievements.service';
import { AchievementsController } from './achievements.controller';
import { CacheModule } from 'src/cache/cache.module';
import { DatabaseModule } from 'src/database/database.module';
import { AchievementsRepository } from './achievements.repository';
import { TrashcansModule } from 'src/trashcans/trashcans.module';

@Module({
  imports: [
    forwardRef(() => {
      return CacheModule;
    }),
    forwardRef(() => {
      return TrashcansModule;
    }),
    DatabaseModule,
  ],
  controllers: [AchievementsController],
  providers: [AchievementsService, AchievementsRepository],
  exports: [AchievementsService, AchievementsRepository],
})
export class AchievementsModule {}
