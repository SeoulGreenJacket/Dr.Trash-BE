import { Injectable } from '@nestjs/common';
import { CacheService } from 'src/cache/cache.service';
import { TrashSummary } from './dto/trash-summary.dto';
import { TrashRepository } from './trash.repository';

@Injectable()
export class TrashService {
  constructor(
    private readonly trashRepository: TrashRepository,
    private readonly cacheService: CacheService,
  ) {}

  async beginTrashcanUsage(userId: number, trashcanId: number): Promise<void> {
    await this.trashRepository.logTrashcanUsage(userId, trashcanId, true);
  }

  async endTrashcanUsage(userId: number, trashcanId: number): Promise<void> {
    await this.trashRepository.logTrashcanUsage(userId, trashcanId, false);
  }

  async getUserTrashSummary(userId: number): Promise<TrashSummary> {
    return await this.cacheService.getUserTrashSummary(userId);
  }
}
