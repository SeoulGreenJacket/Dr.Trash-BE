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
    try {
      await Promise.all(
        usersPoint.map(({ id, point }) => {
          return this.client.zAdd('user-point', {
            score: point,
            value: id.toString(),
          });
        }),
      );
    } catch (error) {
      console.log('migrate to redis failed: ', error);
    }
  }

  async migrateUsersTrash() {
    const usersTrash = await this.databaseService.query<{
      userId: string;
      type: string;
      at: Date;
      ok: string;
    }>(`
      SELECT "userId", "type", "at", "ok" FROM ${database.tables.trash};
    `);
    return Promise.all(
      usersTrash.map(({ userId, type, at, ok }) => {
        const key = `user-trash:${userId}-${at.getUTCFullYear()}-${at.getUTCMonth()}`;
        const field = `${type}-${ok ? 'success' : 'failure'}`;
        return this.client.hIncrBy(key, field, 1);
      }),
    );
  }

  async addUserPoint(userId: number, point: number) {
    await this.client.zAdd('user-point', {
      score: point,
      value: userId.toString(),
    });
  }

  async getUserRank(userId: number): Promise<number> {
    return (await this.client.zRevRank('user-point', userId.toString())) + 1;
  }

  async getUserRankList(
    limit: number,
    offset: number,
  ): Promise<{ score: number; value: number }[]> {
    const userRankList = await this.client.zRangeWithScores(
      'user-point',
      offset,
      offset + limit - 1,
      {
        REV: true,
      },
    );
    return userRankList.map(({ score, value }) => {
      return { score, value: parseInt(value) };
    });
  }

  async getUserTrashSummary(
    userId: number,
    year: number,
    month: number,
  ): Promise<TrashSummary> {
    const userTrashSummary = await this.client.hGetAll(
      `user-trash:${userId}-${year}-${month}`,
    );
    return {
      can: {
        success: +(userTrashSummary['can-success'] ?? 0),
        failure: +(userTrashSummary['can-failure'] ?? 0),
      },
      pet: {
        success: +(userTrashSummary['pet-success'] ?? 0),
        failure: +(userTrashSummary['pet-failure'] ?? 0),
      },
      paper: {
        success: +(userTrashSummary['paper-success'] ?? 0),
        failure: +(userTrashSummary['paper-failure'] ?? 0),
      },
      plastic: {
        success: +(userTrashSummary['plastic-success'] ?? 0),
        failure: +(userTrashSummary['plastic-failure'] ?? 0),
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
    await this.client.zIncrBy('user-point', change, userId.toString());
  }

  async updateUserTrash(userId: number, trashType: string, isCorrect: boolean) {
    const today = new Date();
    const key = `user-trash:${userId}-${today.getUTCFullYear()}-${today.getUTCMonth()}`;
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
