import { Module } from '@nestjs/common';
import { TrashController } from './trash.controller';
import { TrashRepository } from './trash.repository';
import { TrashService } from './trash.service';
import { CacheModule } from 'src/cache/cache.module';
import { TrashcansModule } from 'src/trashcans/trashcans.module';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [CacheModule, TrashcansModule, DatabaseModule],
  controllers: [TrashController],
  providers: [TrashService, TrashRepository],
})
export class TrashModule {}
