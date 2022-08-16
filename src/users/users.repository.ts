import { User } from 'src/users/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UsersRepository {
  constructor(private databaseService: DatabaseService) {}
  private readonly schema = process.env.DATABASE_APPLICATION_SCHEMA;
  private readonly userTable = `${this.schema}.user`;
  private readonly oauthTable = `${this.schema}.oauth`;

  async create(name: string, imageUri: string) {
    const result = await this.databaseService.query<{ id: number }>(
      `INSERT INTO ${this.userTable} (name,imageUri,point) VALUES ('${name}', '${imageUri}', 0) RETURNING id;`,
    );
    return result.length === 1 ? result[0].id : null;
  }

  async checkByOAuth(oauthId: string, provider: string) {
    const result = await this.databaseService.query<{ userId: number }>(
      `SELECT userId FROM ${this.oauthTable} WHERE oauthId='${oauthId}' AND provider='${provider}';`,
    );
    return result.length === 1 ? result[0].userId : null;
  }

  async findByUserId(userId: number) {
    const result = await this.databaseService.query<User>(
      `SELECT * FROM ${this.userTable} WHERE id=${userId};`,
    );
    return result.length === 1 ? result[0] : null;
  }

  async createOAuth(oauthId: string, provider: string, userId: number) {
    const result = await this.databaseService.query<{ id: number }>(
      `INSERT INTO ${this.oauthTable} (userId, provider, oauthId) VALUES (${userId}, '${provider}', '${oauthId}') RETURNING id;`,
    );
    return result.length === 1 ? result[0].id : null;
  }
}
