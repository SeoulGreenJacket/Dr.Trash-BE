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
    Promise.all(
      usersPoint.map(async ({ id, point }) => {
        await this.client.zAdd('user-point', {
          score: point,
          value: id.toString(),
        });
      }),
    );
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

  async getUserTrashSummary(userId: number): Promise<TrashSummary> {
    const userTrashSummary = await this.client.hGetAll(`user-trash:${userId}`);
    return {
      can: {
        success: +userTrashSummary['can-success'],
        failure: +userTrashSummary['can-failure'],
      },
      pet: {
        success: +userTrashSummary['pet-success'],
        failure: +userTrashSummary['pet-failure'],
      },
      paper: {
        success: +userTrashSummary['paper-success'],
        failure: +userTrashSummary['paper-failure'],
      },
      plastic: {
        success: +userTrashSummary['plastic-success'],
        failure: +userTrashSummary['plastic-failure'],
      },
    };
  }

  async updateUserPoint(userId: number, change: number) {
    await this.client.zIncrBy('user-point', change, userId.toString());
  }

  updateUserTrash(userId: number, trashType: string, isCorrect: boolean) {
    const key = `user-trash:${userId}`;
    const field = `${trashType}-${isCorrect ? 'success' : 'failure'}`;
    this.client.hIncrBy(key, field, 1);
  }
}
