import { Injectable } from '@nestjs/common';
import { CacheService } from 'src/cache/cache.service';
import { TrashcansService } from 'src/trashcans/trashcans.service';
import { AchievementsRepository } from './achievements.repository';

@Injectable()
export class AchievementsService {
  private readonly trashAchievements = [
    { id: 1, criterion: 1 },
    { id: 0, criterion: 10 },
    { id: 0, criterion: 100 },
  ];
  private readonly plasticAchievements = [
    { id: 0, criterion: 100 },
    { id: 0, criterion: 1000 },
    { id: 0, criterion: 10000 },
  ];
  private readonly canAchievements = [
    { id: 0, criterion: 100 },
    { id: 0, criterion: 1000 },
    { id: 0, criterion: 10000 },
  ];
  private readonly paperAchievements = [
    { id: 0, criterion: 100 },
    { id: 0, criterion: 1000 },
    { id: 0, criterion: 10000 },
  ];
  private readonly petAchievements = [
    { id: 0, criterion: 100 },
    { id: 0, criterion: 1000 },
    { id: 0, criterion: 10000 },
  ];
  private readonly rankAchievements = [
    { id: 2, criterion: 3 },
    { id: 0, criterion: 10 },
    { id: 0, criterion: 30 },
  ];
  private readonly pointAchievements = [
    { id: 4, criterion: 1000 },
    { id: 0, criterion: 10000 },
    { id: 0, criterion: 100000 },
  ];
  private readonly trashcanAchievements = [
    { id: 5, criterion: 5 },
    { id: 0, criterion: 10 },
    { id: 0, criterion: 50 },
  ];

  constructor(
    private readonly cacheService: CacheService,
    private readonly trashcansService: TrashcansService,
    private readonly achievementsRepository: AchievementsRepository,
  ) {}

  async unlockAchievement(id: number, userId: number) {
    await Promise.all([
      this.achievementsRepository.unlock(userId, id),
      this.cacheService.updateAchievementNotification(userId, id),
    ]);
  }

  async checkTrashAchievements(userId: number) {
    const point = await this.cacheService.getUserPoint(userId);
    const rank = await this.cacheService.getUserRank(userId);
    const trashCounts = await this.cacheService.getUserTrashAllSummary(userId);
    const trashTotalCount = {
      success:
        trashCounts.can.success +
        trashCounts.pet.success +
        trashCounts.paper.success +
        trashCounts.plastic.success,
      failure:
        trashCounts.can.failure +
        trashCounts.pet.failure +
        trashCounts.paper.failure +
        trashCounts.plastic.failure,
    };
    const ids = await this.achievementsRepository.getAchievableIds(userId);
    await Promise.all([
      ...this.trashAchievements.map(({ id, criterion }) => {
        if (
          ids.includes(id) &&
          trashTotalCount.success + trashTotalCount.failure >= criterion
        ) {
          return this.unlockAchievement(id, userId);
        }
      }),
      ...this.plasticAchievements.map(({ id, criterion }) => {
        if (ids.includes(id) && trashCounts.plastic.success >= criterion) {
          return this.unlockAchievement(id, userId);
        }
      }),
      ...this.canAchievements.map(({ id, criterion }) => {
        if (ids.includes(id) && trashCounts.can.success >= criterion) {
          return this.unlockAchievement(id, userId);
        }
      }),
      ...this.paperAchievements.map(({ id, criterion }) => {
        if (ids.includes(id) && trashCounts.paper.success >= criterion) {
          return this.unlockAchievement(id, userId);
        }
      }),
      ...this.petAchievements.map(({ id, criterion }) => {
        if (ids.includes(id) && trashCounts.pet.success >= criterion) {
          return this.unlockAchievement(id, userId);
        }
      }),
      ...this.pointAchievements.map(({ id, criterion }) => {
        if (ids.includes(id) && point >= criterion) {
          return this.unlockAchievement(id, userId);
        }
      }),
      ...this.rankAchievements.map(({ id, criterion }) => {
        if (ids.includes(id) && rank <= criterion) {
          return this.unlockAchievement(id, userId);
        }
      }),
    ]);
  }

  async checkTrashcanAchievements(userId: number) {
    const trashcans = await this.trashcansService.findByManagerId(userId);
    const trashcansCount = trashcans.length;
    const ids = await this.achievementsRepository.getAchievableIds(userId);

    await Promise.all([
      ...this.trashcanAchievements.map(({ id, criterion }) => {
        if (ids.includes(id) && trashcansCount >= criterion) {
          return this.unlockAchievement(id, userId);
        }
      }),
    ]);
  }
}
