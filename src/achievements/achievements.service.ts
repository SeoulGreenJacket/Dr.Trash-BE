import { Injectable } from '@nestjs/common';
import { CacheService } from 'src/cache/cache.service';
import { AchievementsRepository } from './achievements.repository';

@Injectable()
export class AchievementsService {
  private readonly plasticAchievements = [
    { id: 1, criterion: 100 },
    { id: 2, criterion: 1000 },
    { id: 3, criterion: 10000 },
  ];
  private readonly canAchievements = [
    { id: 4, criterion: 100 },
    { id: 5, criterion: 1000 },
    { id: 6, criterion: 10000 },
  ];
  private readonly paperAchievements = [
    { id: 7, criterion: 100 },
    { id: 8, criterion: 1000 },
    { id: 9, criterion: 10000 },
  ];

  constructor(
    private readonly cacheService: CacheService,
    private readonly achievementsRepository: AchievementsRepository,
  ) {}

  async unlockAchievement(id: number, userId: number) {
    await Promise.all([
      this.achievementsRepository.unlock(userId, id),
      this.cacheService.updateAchievementNotification(userId, id),
    ]);
  }

  async checkTrashAchievements(userId: number) {
    const trashCounts = await this.cacheService.getUserTrash(userId);
    const ids = await this.achievementsRepository.getAchievableIds(userId);
    await Promise.all([
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
    ]);
  }
}
