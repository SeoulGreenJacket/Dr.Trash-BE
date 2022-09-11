import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType as Client } from 'redis';
import { database } from 'src/common/environments';
import { DatabaseService } from 'src/database/database.service';
import { TrashSummary } from 'src/trash/dto/trash-summary.dto';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { OneTrialTrashSummary } from 'src/trash/dto/one-trial-trash-summary.dto';

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
      userId: number;
      trashcanId: string;
      open: Date;
      close: Date;
    }>(
      `SELECT "userId", "trashcanId", "open", "close" FROM ${database.tables.trashcanUsage};`,
    );
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
    const usersTrashLogsInTrial = (
      await Promise.all(
        usersTrashUsage.map(({ userId, open, close }) => {
          const [openString, closeString] = [open, close].map((date) => {
            return format(date, 'yyyy-MM-dd HH:mm:ss.SSS', { locale: ko });
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
  ): Promise<OneTrialTrashSummary[]> {
    const userTrashUsagesInMonth = await this.client.lRange(
      `user-trash:${userId}-${year}-${month}`,
      0,
      -1,
    );

    return (
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
        date: new Date(userTrashUsagesInMonth[index]),
        type,
        success,
        failure,
      };
    });
  }

  async addUserUsageTrialTrash(
    userId: number,
    open: Date,
    close: Date,
  ): Promise<OneTrialTrashSummary> {
    const [openString, closeString] = [open, close].map((date) => {
      return format(date, 'yyyy-MM-dd HH:mm:ss.SSS', { locale: ko });
    });
    await this.client.rPush(
      `user-trash:${userId}-${open.getFullYear()}-${open.getMonth() + 1}`,
      openString,
    );
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
    let type: string,
      success = 0,
      failure = 0;
    await Promise.all(
      trashLogs.map(({ type: trashType, ok }) => {
        const key = `user-trash:${userId}-${openString}`;
        const field = `${trashType}-${ok ? 'success' : 'failure'}`;
        type = trashType;
        ok ? success++ : failure++;
        return this.client.hIncrBy(key, field, 1);
      }),
    );
    return {
      date: open,
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

  async getUserTrashAllSummary(userId: number): Promise<TrashSummary> {
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

  async updateUserTrashAllSummary(userId, type, successNum, failureNum) {
    const key = `user-trash:${userId}`;
    await this.client.hIncrBy(key, `${type}-success`, successNum);
    await this.client.hIncrBy(key, `${type}-failure`, failureNum);
  }

  async updateUserPoint(userId: number, change: number) {
    await this.client.zIncrBy('user-point', change, userId.toString());
  }
}
