import { UsersModule } from 'src/users/users.module';
import { forwardRef, Module } from '@nestjs/common';
import { TrashController } from './trash.controller';
import { TrashRepository } from './trash.repository';
import { TrashService } from './trash.service';
import { TrashcansModule } from 'src/trashcans/trashcans.module';
import { DatabaseModule } from 'src/database/database.module';
import { AchievementsModule } from 'src/achievements/achievements.module';
import { KafkaModule } from 'src/kafka/kafka.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    forwardRef(() => AchievementsModule),
    TrashcansModule,
    DatabaseModule,
    KafkaModule,
  ],
  controllers: [TrashController],
  providers: [TrashService, TrashRepository],
  exports: [TrashService],
})
export class TrashModule {}
