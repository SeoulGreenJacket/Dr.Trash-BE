import { OneTrialTrashSummary } from './dto/one-trial-trash-summary.dto';
import { UsersRepository } from 'src/users/users.repository';
import { ConflictException, Injectable } from '@nestjs/common';
import { CacheService } from 'src/cache/cache.service';
import { TrashSummary } from './dto/trash-summary.dto';
import { TrashRepository } from './trash.repository';
import { UserEndTrashRes } from './dto/user-end-trash-response.dto';
import { KafkaService } from 'src/kafka/kafka.service';
import { setTimeout } from 'timers/promises';

@Injectable()
export class TrashService {
  constructor(
    private readonly trashRepository: TrashRepository,
    private readonly cacheService: CacheService,
    private readonly usersRepository: UsersRepository,
    private readonly kafkaService: KafkaService,
  ) {}

  async beginTrashcanUsage(
    userId: number,
    trashcanId: number,
  ): Promise<number> {
    const usageId = await this.trashRepository.createTrashcanUsage(
      userId,
      trashcanId,
    );
    this.kafkaService.send(trashcanId.toString(), 'start');
    return usageId;
  }

  async endTrashcanUsage(
    usageId: number,
    trashcanType: string,
  ): Promise<UserEndTrashRes> {
    const usage = await this.trashRepository.getLastUsage(usageId);
    if (usage) {
      this.kafkaService.send(usage?.code.toString(), 'pause');
    } else {
      throw new ConflictException('Open trashcan first');
    }

    // wait for last image to be processed
    // TODO: change to something better
    await setTimeout(5000, 'All done');

    const { userId, open, close } =
      await this.trashRepository.updateTrashcanUsage(usageId);
    const UserUsageTrialTrash = await this.cacheService.addUserUsageTrialTrash(
      userId,
      open,
      close,
      trashcanType,
    );
    const userGetPoint = UserUsageTrialTrash.success * 10;
    const beforePoint = (await this.usersRepository.findByUserId(userId)).point;
    await this.usersRepository.increaseUserPoint(userId, userGetPoint);
    await this.cacheService.updateUserPoint(userId, userGetPoint);
    await this.cacheService.updateUserTrashAllSummary(
      userId,
      UserUsageTrialTrash.type,
      UserUsageTrialTrash.success,
      UserUsageTrialTrash.failure,
    );
    return { ...UserUsageTrialTrash, beforePoint };
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
