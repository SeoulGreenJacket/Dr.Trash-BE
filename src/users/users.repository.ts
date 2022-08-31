import { User } from 'src/users/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Achievement } from './types/achievement.type';

@Injectable()
export class UsersRepository {
  constructor(private databaseService: DatabaseService) {}
  private readonly schema = process.env.DATABASE_APPLICATION_SCHEMA;
  private readonly userTable = `${this.schema}.user`;
  private readonly achievementTable = `${this.schema}.achievement`;
  private readonly achieverTable = `${this.schema}.achiever`;

  async create(
    name: string,
    thumbnail: string,
    kakaoId: bigint,
  ): Promise<number> {
    const result = await this.databaseService.query<{ id: number }>(
      `INSERT INTO ${this.userTable} ("kakaoId",name,thumbnail,point) VALUES (${kakaoId},'${name}', '${thumbnail}', 0) RETURNING id;`,
    );
    return result.length === 1 ? result[0].id : null;
  }

  async findByKakaoId(kakaoId: bigint): Promise<User> {
    const result = await this.databaseService.query<User>(
      `SELECT * FROM ${this.userTable} WHERE "kakaoId" = ${kakaoId};`,
    );
    return result.length === 1 ? result[0] : null;
  }

  async findByUserId(userId: number): Promise<User> {
    const result = await this.databaseService.query<User>(
      `SELECT * FROM ${this.userTable} WHERE id=${userId};`,
    );
    return result.length === 1 ? result[0] : null;
  }

  async findAcheiveByUserId(userId: number): Promise<Achievement[]> {
    const result = await this.databaseService.query<Achievement>(
      `SELECT ${this.achievementTable}.*,${this.achieverTable}."achievedAt"
        FROM ${this.achievementTable} LEFT JOIN ${this.achieverTable}
            ON ${this.achievementTable}.id = ${this.achieverTable}."achievementId"
            AND ${this.achieverTable}."userId" = ${userId};`,
    );
    return result;
  }

  async update(name: string, thumbnail: string, id: number): Promise<User> {
    const result = await this.databaseService.query<User>(
      `UPDATE ${this.userTable} SET name='${name}', thumbnail='${thumbnail}' 
        WHERE id=${id} 
        RETURNING *;`,
    );
    return result.length === 1 ? result[0] : null;
  }

  async delete(id: number): Promise<number> {
    const result = await this.databaseService.query<User>(
      `DELETE FROM ${this.userTable} WHERE id=${id} RETURNING id;`,
    );
    return result.length === 1 ? result[0].id : null;
  }
}
