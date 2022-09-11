import { OneTrialTrashSummary } from './dto/one-trial-trash-summary.dto';
import { UsersRepository } from 'src/users/users.repository';
import { Injectable } from '@nestjs/common';
import { CacheService } from 'src/cache/cache.service';
import { TrashSummary } from './dto/trash-summary.dto';
import { TrashRepository } from './trash.repository';
import { UserEndTrashRes } from './dto/user-end-trash-response.dto';

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
    const type = ['pet', 'plastic'];
    for (let i = 0; i < 2; i++) {
      this.trashRepository.testInsert(userId, trashcanId, type[i], true);
      this.trashRepository.testInsert(userId, trashcanId, type[i], false);
    }
    return await this.trashRepository.createTrashcanUsage(userId, trashcanId);
  }

  async endTrashcanUsage(usageId: number): Promise<UserEndTrashRes> {
    const { userId, open, close } =
      await this.trashRepository.updateTrashcanUsage(usageId);
    const UserUsageTrialTrash = await this.cacheService.addUserUsageTrialTrash(
      userId,
      open,
      close,
    );
    const totalPoint = (await this.usersRepository.findByUserId(userId)).point;
    await this.cacheService.updateUserTrashAllSummary(
      userId,
      UserUsageTrialTrash.type,
      UserUsageTrialTrash.success,
      UserUsageTrialTrash.failure,
    );

    return { ...UserUsageTrialTrash, totalPoint };
  }

  async getUserTrashSummaryAll(userId: number): Promise<TrashSummary> {
    return await this.cacheService.getUserTrashAllSummary(userId);
  }

  async getUserTrashSummaryDetail(
    userId: number,
    year: number,
    month: number,
  ): Promise<OneTrialTrashSummary[]> {
    return await this.cacheService.getUserTrashMonthlySummary(
      userId,
      year,
      month,
    );
  }
}
