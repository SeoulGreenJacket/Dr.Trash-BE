import { UsersRepository } from 'src/users/users.repository';
import { Injectable } from '@nestjs/common';
import { CacheService } from 'src/cache/cache.service';
import { TrashSummary } from './dto/trash-summary.dto';
import { TrashRepository } from './trash.repository';

@Injectable()
export class TrashService {
  constructor(
    private readonly trashRepository: TrashRepository,
    private readonly cacheService: CacheService,
    private readonly usersRepository: UsersRepository,
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
    const UserUsageTrialTrash = await this.cacheService.addUserUsageTrialTrash(
      userId,
      open,
      close,
    );
    const totalPoint = await (
      await this.usersRepository.findByUserId(userId)
    ).point;

    return { ...UserUsageTrialTrash, totalPoint };
  }

  async getUserTrashSummaryAll(userId: number): Promise<TrashSummary> {
    return await this.cacheService.getUserTrashSummary(userId);
  }

  async getUserTrashSummaryInMonth(
    userId: number,
    year: number,
    month: number,
  ) {
    return await this.cacheService.getUserTrashMonthlySummary(
      userId,
      year,
      month,
    );
  }
}
