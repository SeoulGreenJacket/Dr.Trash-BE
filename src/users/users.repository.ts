import { User } from 'src/users/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { database } from 'src/common/environments';
import { Achievement } from './entities/achievement.entity';

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

  async findByKakaoId(kakaoId: bigint) {
    const result = await this.databaseService.query<User>(`
      SELECT * FROM ${database.tables.user} WHERE "kakaoId" = ${kakaoId};
    `);
    return result.length === 1 ? result[0] : null;
  }

  async findByUserId(userId: number): Promise<User> {
    const result = await this.databaseService.query<User>(
      `SELECT * FROM ${database.tables.user} WHERE id=${userId};`,
    );
    return result.length === 1 ? result[0] : null;
  }

  async findAcheiveByUserId(userId: number): Promise<Achievement[]> {
    const result = await this.databaseService.query<Achievement>(
      `SELECT ${database.tables.achievement}.*,${database.tables.achiever}."achievedAt"
        FROM ${database.tables.achievement} LEFT JOIN ${database.tables.achiever}
            ON ${database.tables.achievement}.id = ${database.tables.achiever}."achievementId"
            AND ${database.tables.achiever}."userId" = ${userId};`,
    );
    return result;
  }

  async update(name: string, thumbnail: string, id: number): Promise<User> {
    const result = await this.databaseService.query<User>(
      `UPDATE ${database.tables.user} SET name='${name}', thumbnail='${thumbnail}' 
        WHERE id=${id} 
        RETURNING *;`,
    );
    return result.length === 1 ? result[0] : null;
  }

  async delete(id: number): Promise<number> {
    const result = await this.databaseService.query<User>(
      `DELETE FROM ${database.tables.user} WHERE id=${id} RETURNING id;`,
    );
    return result.length === 1 ? result[0].id : null;
  }
}
