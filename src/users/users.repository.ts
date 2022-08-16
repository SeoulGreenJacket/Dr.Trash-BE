import { User } from 'src/users/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UsersRepository {
  constructor(private databaseService: DatabaseService) {}
  private readonly schema = process.env.DATABASE_APPLICATION_SCHEMA;
  private readonly userTable = `${this.schema}.user`;
  private readonly oauthTable = `${this.schema}.oauth`;

  async create(name: string, thumbnail: string) {
    const result = await this.databaseService.query<{ id: number }>(
      `INSERT INTO ${this.userTable} (name,thumbnail,point) VALUES ('${name}', '${thumbnail}', 0) RETURNING id;`,
    );
    return result.length === 1 ? result[0].id : null;
  }

  async findByOAuth(oauthId: string, provider: string) {
    const result = await this.databaseService.query<User>(`
      SELECT * 
      FROM ${this.userTable} 
        JOIN ${this.oauthTable} ON ${this.userTable}.id = ${this.oauthTable}.userid 
      WHERE ${this.oauthTable}.id='${oauthId}' AND ${this.oauthTable}.provider='${provider}';
    `);
    return result.length === 1 ? result[0] : null;
  }

  async findByUserId(userId: number) {
    const result = await this.databaseService.query<User>(
      `SELECT * FROM ${this.userTable} WHERE id=${userId};`,
    );
    return result.length === 1 ? result[0] : null;
  }

  async createOAuth(oauthId: string, provider: string, userId: number) {
    const result = await this.databaseService.query<{ userid: number }>(
      `INSERT INTO ${this.oauthTable} (userid, provider, id) VALUES (${userId}, '${provider}', '${oauthId}') RETURNING userid;`,
    );
    return result.length === 1 ? result[0].userid : null;
  }
}
