import { User } from 'src/users/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { database } from 'src/common/environments';

@Injectable()
export class UsersRepository {
  constructor(private databaseService: DatabaseService) {}

  async create(
    name: string,
    thumbnail: string,
    kakaoId: bigint,
  ): Promise<User> {
    const result = await this.databaseService.query<User>(
      `INSERT INTO ${database.tables.user} ("kakaoId",name,thumbnail,point) VALUES (${kakaoId},'${name}', '${thumbnail}', 0) RETURNING *;`,
    );
    return result.length === 1 ? result[0] : null;
  }

  async findOne(where: {
    [key: string]: string | number | bigint;
  }): Promise<User> {
    const result = await this.databaseService.query<User>(`
      SELECT
        *
      FROM
        ${database.tables.user}
      WHERE
        ${Object.keys(where)
          .map((key) => `"${key}"='${where[key]}'`)
          .join(' AND ')}
    `);
    return result.length === 1 ? result[0] : null;
  }

  async findAll(
    orderBy: 'point' | 'id',
    order: 'ASC' | 'DESC',
    limit: number,
    offset: number,
  ): Promise<User[]> {
    const result = await this.databaseService.query<User>(`
      SELECT
        *
      FROM
        ${database.tables.user}
        ORDER BY ${orderBy} ${order};
      LIMIT ${limit}
      OFFSET ${offset}
    `);
    return result;
  }

  async findRank(userId: number): Promise<number> {
    const queryResult = await this.databaseService.query<{ rank: number }>(`
        SELECT
          rank
        FROM (
          SELECT
            id,
            RANK() OVER (ORDER BY point DESC) AS rank
          FROM
            ${database.tables.user}
        ) AS rank_table
        WHERE
          rank_table.id = ${userId}
    `);
    return queryResult.length === 1 ? queryResult[0].rank : null;
  }

  async findRankAll(limit: number, offset: number): Promise<User[]> {
    const result = await this.databaseService.query<User>(`
      SELECT
        *,
        RANK() OVER (ORDER BY point DESC) AS rank
      FROM
        ${database.tables.user}
      LIMIT ${limit}
      OFFSET ${offset}
    `);
    return result;
  }

  async update(
    id: number,
    values: {
      [key: string]: string | number | bigint;
    },
  ): Promise<User> {
    const result = await this.databaseService.query<User>(`
      UPDATE
        ${database.tables.user}
      SET
        ${Object.keys(values)
          .map((key) => `"${key}"='${values[key]}'`)
          .join(', ')}
      WHERE
        id=${id}
      RETURNING *
    `);
    return result.length === 1 ? result[0] : null;
  }

  async delete(id: number): Promise<number> {
    const result = await this.databaseService.query<User>(
      `DELETE FROM ${database.tables.user} WHERE id=${id} RETURNING id;`,
    );
    return result.length === 1 ? result[0].id : null;
  }

  async countUserTrashTrial(id: number): Promise<number> {
    const result = await this.databaseService.query<{ count: number }>(
      `SELECT COUNT(*) FROM ${database.tables.trashcanUsage}
        WHERE "userId"=${id};`,
    );
    return result.length === 1 ? result[0].count : null;
  }

  async increaseUserPoint(id: number, getPoint: number): Promise<User> {
    const result = await this.databaseService.query<User>(
      `UPDATE ${database.tables.user} SET point= point+${getPoint} WHERE id=${id} RETURNING *;`,
    );
    return result.length === 1 ? result[0] : null;
  }

  async resetUserPoint(): Promise<User[]> {
    const result = await this.databaseService.query<User>(
      `UPDATE ${database.tables.user} SET point=0 RETURNING *;`,
    );
    return result;
  }
}
