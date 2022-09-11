import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType as Client } from 'redis';
import { database } from 'src/common/environments';
import { DatabaseService } from 'src/database/database.service';
import { TrashSummary } from 'src/trash/dto/trash-summary.dto';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

@Injectable()
export class CacheService {
  constructor(
    @Inject('REDIS_CLIENT') private client: Client,
    private readonly databaseService: DatabaseService,
  ) {}

  async flushAll() {
    await this.client.flushAll();
  }

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

  async migrateUsersAllTrash() {
    const usersTrash = await this.databaseService.query<{
      userId: string;
      type: string;
      at: Date;
      ok: string;
    }>(`
      SELECT "userId", "type", "at", "ok" FROM ${database.tables.trash};
    `);
    return Promise.all(
      usersTrash.map(({ userId, type, ok }) => {
        const key = `user-trash:${userId}`;
        const field = `${type}-${ok ? 'success' : 'failure'}`;
        return this.client.hIncrBy(key, field, 1);
      }),
    );
  }

  async migrateUsersUsageTrialTrash() {
    const usersTrashUsage = await this.databaseService.query<{
      userId: string;
      trashcanId: string;
      open: Date;
      close: Date;
    }>(
      `SELECT "userId", "trashcanId", "open", "close" FROM ${database.tables.trashcanUsage};`,
    );

    try {
      await Promise.all(
        usersTrashUsage.map(({ userId, open }) => {
          const openString = format(open, 'yyyy-MM-dd HH:mm:ss.SSS', {
            locale: ko,
          });
          const key = `user-trash:${userId}-${open.getFullYear()}-${
            open.getMonth() + 1
          }`;
          return this.client.rPush(key, openString);
        }),
      );
    } catch (error) {
      console.log(error);
    }

    const usersTrashLogsInTrial = (
      await Promise.all(
        usersTrashUsage.map(({ userId, open, close }) => {
          const openString = format(open, 'yyyy-MM-dd HH:mm:ss.SSS', {
            locale: ko,
          });
          const closeString = format(close, 'yyyy-MM-dd HH:mm:ss.SSS', {
            locale: ko,
          });
          return this.databaseService.query<{
            userId: string;
            type: string;
            at: Date;
            ok: string;
          }>(
            `SELECT "userId", "type", "at", "ok" FROM ${database.tables.trash} 
              WHERE "userId" = ${userId} 
              AND "at" BETWEEN '${openString}' AND '${closeString}';`,
          );
        }),
      )
    ).map((trashLogs, index) => {
      return {
        userId: usersTrashUsage[index].userId,
        open: format(usersTrashUsage[index].open, 'yyyy-MM-dd HH:mm:ss.SSS', {
          locale: ko,
        }),
        trashLogs,
      };
    });

    await Promise.all(
      usersTrashLogsInTrial.map(({ userId, open, trashLogs }) => {
        return Promise.all(
          trashLogs.map(({ type, ok }) => {
            const key = `user-trash:${userId}-${open}`;
            const field = `${type}-${ok ? 'success' : 'failure'}`;
            return this.client.hIncrBy(key, field, 1);
          }),
        );
      }),
    );
  }

  async getUserTrashMonthlySummary(
    userId: number,
    year: number,
    month: number,
  ): Promise<any> {
    const userTrashUsagesInMonth = await this.client.lRange(
      `user-trash:${userId}-${year}-${month}`,
      0,
      -1,
    );

    const userTrashLogsInMonth = (
      await Promise.all(
        userTrashUsagesInMonth.map((open) => {
          return this.client.hGetAll(`user-trash:${userId}-${open}`);
        }),
      )
    ).map((userTrashLogsInOneUsage, index) => {
      const type = Object.keys(userTrashLogsInOneUsage)[0]?.split('-')[0];
      const success = +(userTrashLogsInOneUsage[`${type}-success`] ?? 0);
      const failure = +(userTrashLogsInOneUsage[`${type}-failure`] ?? 0);
      return {
        Date: new Date(userTrashUsagesInMonth[index]),
        type,
        success,
        failure,
      };
    });
    return userTrashLogsInMonth;
  }

  async addUserUsageTrialTrash(userId, open, close) {
    const openString = format(open, 'yyyy-MM-dd HH:mm:ss.SSS', { locale: ko });
    const closeString = format(close, 'yyyy-MM-dd HH:mm:ss.SSS', {
      locale: ko,
    });
    const trashLogs = await this.databaseService.query<{
      userId: string;
      type: string;
      at: Date;
      ok: string;
    }>(
      `SELECT "userId", "type", "at", "ok" FROM ${database.tables.trash} 
          WHERE "userId" = ${userId} 
          AND "at" BETWEEN '${openString}' AND '${closeString}';`,
    );
    await Promise.all(
      trashLogs.map(({ type, ok }) => {
        const key = `user-trash:${userId}-${open}`;
        const field = `${type}-${ok ? 'success' : 'failure'}`;
        return this.client.hIncrBy(key, field, 1);
      }),
    );

    const userTrashLogsInOneUsage = await this.client.hGetAll(
      `user-trash:${userId}-${open}`,
    );

    const type = Object.keys(userTrashLogsInOneUsage)[0]?.split('-')[0];
    const success = +(userTrashLogsInOneUsage[`${type}-success`] ?? 0);
    const failure = +(userTrashLogsInOneUsage[`${type}-failure`] ?? 0);

    return {
      Date: open,
      type,
      success,
      failure,
    };
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
