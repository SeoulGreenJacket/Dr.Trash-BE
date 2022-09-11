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

  async beginTrashcanUsage(
    userId: number,
    trashcanId: number,
  ): Promise<number> {
    return await this.trashRepository.createTrashcanUsage(userId, trashcanId);
  }

  async endTrashcanUsage(usageId: number) {
    const { userId, open, close } =
      await this.trashRepository.updateTrashcanUsage(usageId);
    await this.cacheService.addUserUsageTrialTrash(userId, open, close);
  }

  async getUserTrashSummaryAll(userId: number): Promise<TrashSummary> {
    return await this.cacheService.getUserTrashSummary(userId);
  }

  async getUserTrashSummaryInMonth(
    userId: number,
    year: number,
    month: number,
  ): Promise<TrashSummary> {
    return await this.cacheService.getUserTrashMonthlySummary(
      userId,
      year,
      month,
    );
  }
}
