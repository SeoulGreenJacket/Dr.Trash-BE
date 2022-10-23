import { Injectable } from '@nestjs/common';
import { TrashService } from 'src/trash/trash.service';
import { TrashcansService } from 'src/trashcans/trashcans.service';
import { UsersService } from 'src/users/users.service';
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
    private readonly trashService: TrashService,
    private readonly trashcansService: TrashcansService,
    private readonly usersService: UsersService,

    private readonly achievementsRepository: AchievementsRepository,
  ) {}

  private notifications = {};

  async updateNotification(userId: number, achvId: number) {
    if (this.notifications[userId] === undefined) {
      this.notifications[userId] = [];
    }
    this.notifications[userId].push(achvId);
  }

  async getNotifications(userId: number) {
    const achvs = this.notifications[userId];
    if (achvs === undefined) {
      return [];
    }

    const achievements = await Promise.all(
      achvs.map(async (id: number) =>
        this.achievementsRepository.getAchievement(id),
      ),
    );
    return achievements;
  }

  async unlockAchievement(id: number, userId: number) {
    await Promise.all([
      this.achievementsRepository.unlock(userId, id),
      this.updateNotification(userId, id),
    ]);
  }

  async checkTrashAchievements(userId: number) {
    const { point } = await this.usersService.findOne(userId);
    const rank = await this.usersService.findRank(userId);
    const trashTrails = await this.trashService.getTrashTrails(userId);
    const trashCounts = trashTrails.reduce(
      (acc, { type, success, failure }) => {
        acc[type].success += success;
        acc[type].failure += failure;
        return acc;
      },
      {
        plastic: { success: 0, failure: 0 },
        pet: { success: 0, failure: 0 },
        can: { success: 0, failure: 0 },
      },
    );
    const trashTotalCount = {
      success:
        trashCounts.plastic.success +
        trashCounts.pet.success +
        trashCounts.can.success,
      failure:
        trashCounts.plastic.failure +
        trashCounts.pet.failure +
        trashCounts.can.failure,
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
