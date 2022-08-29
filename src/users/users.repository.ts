import { User } from 'src/users/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { database } from 'src/common/environments';

@Injectable()
export class UsersRepository {
  constructor(private databaseService: DatabaseService) {}

  async create(name: string, thumbnail: string, kakaoId: bigint) {
    const result = await this.databaseService.query<{ id: number }>(
      `INSERT INTO ${database.tables.user} ("kakaoId",name,thumbnail,point) VALUES (${kakaoId},'${name}', '${thumbnail}', 0) RETURNING id;`,
    );
    return result.length === 1 ? result[0].id : null;
  }

  async findByKakaoId(kakaoId: bigint) {
    const result = await this.databaseService.query<User>(`
      SELECT * FROM ${database.tables.user} WHERE "kakaoId" = ${kakaoId};
    `);
    return result.length === 1 ? result[0] : null;
  }

  async findByUserId(userId: number) {
    const result = await this.databaseService.query<User>(
      `SELECT * FROM ${database.tables.user} WHERE id=${userId};`,
    );
    return result.length === 1 ? result[0] : null;
  }
}
