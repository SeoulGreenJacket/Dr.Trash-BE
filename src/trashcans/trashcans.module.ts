import { Module } from '@nestjs/common';
import { TrashcansService } from './trashcans.service';
import { TrashcansController } from './trashcans.controller';
import { TrashcansRepository } from './trashcans.repository';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [TrashcansController],
  providers: [TrashcansService, TrashcansRepository],
})
export class TrashcansModule {}
