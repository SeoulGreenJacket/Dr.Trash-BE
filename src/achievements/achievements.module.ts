import { Module, forwardRef } from '@nestjs/common';
import { AchievementsService } from './achievements.service';
import { AchievementsController } from './achievements.controller';
import { DatabaseModule } from 'src/database/database.module';
import { AchievementsRepository } from './achievements.repository';
import { TrashcansModule } from 'src/trashcans/trashcans.module';
import { UsersModule } from 'src/users/users.module';
import { TrashModule } from 'src/trash/trash.module';

@Module({
  imports: [
    forwardRef(() => TrashcansModule),
    forwardRef(() => UsersModule),
    TrashModule,
    DatabaseModule,
  ],
  controllers: [AchievementsController],
  providers: [AchievementsService, AchievementsRepository],
  exports: [AchievementsService, AchievementsRepository],
})
export class AchievementsModule {}
