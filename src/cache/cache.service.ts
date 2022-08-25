import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType as Client } from 'redis';
import { TrashSummary } from 'src/trash/dto/trash-summary.dto';

@Injectable()
export class CacheService {
  constructor(@Inject('REDIS_CLIENT') private client: Client) {}

  async getUserRank(userId: number): Promise<number> {
    return await this.client.zRevRank('user-point', userId.toString());
  }

  async getUserRankList(offset: number, limit: number): Promise<number[]> {
    const userRankList = await this.client.zRange(
      'user-point',
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
}
