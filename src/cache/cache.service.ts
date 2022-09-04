import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType as Client } from 'redis';
import { AchievementsRepository } from 'src/achievements/achievements.repository';
import { database, redis } from 'src/common/environments';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class CacheService {
  constructor(
    @Inject('REDIS_CLIENT') private client: Client,
    private readonly databaseService: DatabaseService,
    private readonly achievementsRepository: AchievementsRepository,
  ) {}

  async migrateUsersPoint() {
    const usersPoint = await this.databaseService.query<{
      id: number;
      point: number;
    }>(`
      SELECT "id", "point" FROM ${database.tables.user};
    `);
    usersPoint.map(({ id, point }) => {
      this.client.zAdd(redis.keys.userPoint, {
        score: point,
        value: id.toString(),
      });
    });
  }

  async migrateUsersTrash() {
    const usersTrash = await this.databaseService.query<{
      userId: number;
      trashType: string;
      isCorrect: boolean;
    }>(`
      SELECT "userId", "type", "ok" FROM ${database.tables.trash};
    `);
    usersTrash.map(({ userId, trashType, isCorrect }) => {
      const key = `user-trash:${userId}`;
      const field = `${trashType}-${isCorrect ? 'success' : 'failure'}`;
      this.client.hIncrBy(key, field, 1);
    });
  }

  async getUserRank(userId: number): Promise<number> {
    return await this.client.zRevRank(redis.keys.userPoint, userId.toString());
  }

  async getUserRankList(offset: number, limit: number): Promise<number[]> {
    const userRankList = await this.client.zRange(
      redis.keys.userPoint,
      offset,
      offset + limit - 1,
      {
        REV: true,
      },
    );
    return userRankList.map((userId) => {
      return +userId;
    });
  }

  async getUserTrash(userId: number) {
    const userTrash = await this.client.hGetAll(
      `${redis.keys.userTrash}:${userId}`,
    );
    return {
      plastic: {
        success: +userTrash['plastic-success'],
        failure: +userTrash['plastic-failure'],
      },
      paper: {
        success: +userTrash['paper-success'],
        failure: +userTrash['paper-failure'],
      },
      can: {
        success: +userTrash['can-success'],
        failure: +userTrash['can-failure'],
      },
    };
  }

  async getAchievementNotifications(userId: number) {
    const achievementIds = await this.client.sMembers(
      `${redis.keys.achievementNotification}:${userId}`,
    );
    await this.client.del(`${redis.keys.achievementNotification}:${userId}`);
    return Promise.all(
      achievementIds.map((id) => {
        return this.achievementsRepository.getAchievement(+id);
      }),
    );
  }

  async updateUserPoint(userId: number, change: number) {
    await this.client.zIncrBy(redis.keys.userPoint, change, userId.toString());
  }

  async updateUserTrash(userId: number, trashType: string, isCorrect: boolean) {
    const key = `${redis.keys.userTrash}:${userId}`;
    const field = `${trashType}-${isCorrect ? 'success' : 'failure'}`;
    await this.client.hIncrBy(key, field, 1);
  }

  async updateAchievementNotification(userId: number, achievementId: number) {
    await this.client.sAdd(
      `${redis.keys.achievementNotification}:${userId}`,
      achievementId.toString(),
    );
  }
}
