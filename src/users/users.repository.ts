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
