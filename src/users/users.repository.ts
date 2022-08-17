import { User } from 'src/users/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UsersRepository {
  constructor(private databaseService: DatabaseService) {}
  private readonly schema = process.env.DATABASE_APPLICATION_SCHEMA;
  private readonly userTable = `${this.schema}.user`;
  private readonly oauthTable = `${this.schema}.oauth`;

  async create(name: string, thumbnail: string, kakaoId: string) {
    const result = await this.databaseService.query<{ id: number }>(
      `INSERT INTO ${this.userTable} ("kakaoId",name,thumbnail,point) VALUES ('${kakaoId}','${name}', '${thumbnail}', 0) RETURNING id;`,
    );
    return result.length === 1 ? result[0].id : null;
  }

  async findByKakaoId(kakaoId: string) {
    const result = await this.databaseService.query<User>(`
      SELECT * FROM ${this.userTable} WHERE "kakaoId" = '${kakaoId}';
    `);
    return result.length === 1 ? result[0] : null;
  }

  async findByUserId(userId: number) {
    const result = await this.databaseService.query<User>(
      `SELECT * FROM ${this.userTable} WHERE id=${userId};`,
    );
    return result.length === 1 ? result[0] : null;
  }
}
