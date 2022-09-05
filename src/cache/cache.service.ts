import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType as Client } from 'redis';
import { database } from 'src/common/environments';
import { DatabaseService } from 'src/database/database.service';
import { TrashSummary } from 'src/trash/dto/trash-summary.dto';

@Injectable()
export class CacheService {
  constructor(
    @Inject('REDIS_CLIENT') private client: Client,
    private readonly databaseService: DatabaseService,
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

  async updateUserPoint(userId: number, change: number) {
    await this.client.zIncrBy('user-point', change, userId.toString());
  }

  updateUserTrash(userId: number, trashType: string, isCorrect: boolean) {
    const today = new Date();
    const key = `user-trash:${userId}-${today.getUTCFullYear()}-${today.getUTCMonth()}`;
    const field = `${trashType}-${isCorrect ? 'success' : 'failure'}`;
    this.client.hIncrBy(key, field, 1);
  }
}
