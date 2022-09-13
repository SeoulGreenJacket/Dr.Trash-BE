import { forwardRef, Module } from '@nestjs/common';
import { TrashcansService } from './trashcans.service';
import { TrashcansController } from './trashcans.controller';
import { TrashcansRepository } from './trashcans.repository';
import { DatabaseModule } from 'src/database/database.module';
import { AchievementsModule } from 'src/achievements/achievements.module';

@Module({
  imports: [
    forwardRef(() => {
      return AchievementsModule;
    }),
    DatabaseModule,
  ],
  controllers: [TrashcansController],
  providers: [TrashcansService, TrashcansRepository],
  exports: [TrashcansService, TrashcansRepository],
})
export class TrashcansModule {}
