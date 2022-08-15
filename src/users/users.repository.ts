import { User } from 'src/users/entities/user.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UsersRepository {
  constructor(private databaseService: DatabaseService) {}
  private readonly schema = process.env.DATABASE_APPLICATION_SCHEMA;
  private readonly userTable = `${this.schema}.user`;
  private readonly oauthTable = `${this.schema}.oauth`;

  async create(user) {
    const { name, image_uri, point } = user;
    const result = await this.databaseService.query<{ id: number }>(
      `INSERT INTO ${this.userTable} (name,image_uri,point) VALUES ('${name}', '${image_uri}', 0) RETURNING id;`,
    );
    return result.length === 1 ? result[0].id : null;
  }

  async checkByOAuth(oauth_id: string, provider: string) {
    const result = await this.databaseService.query<{ user_id: number }>(
      `SELECT user_id FROM ${this.oauthTable} WHERE oauth_id='${oauth_id}' AND provider='${provider}';`,
    );
    return result.length === 1 ? result[0].user_id : null;
  }

  async findByUserId(user_id: number) {
    const result = await this.databaseService.query<User>(
      `SELECT * FROM ${this.userTable} WHERE id=${user_id};`,
    );
    return result.length === 1 ? result[0] : null;
  }

  async createOAuth(oauth) {
    const { oauth_id, provider, user_id } = oauth;
    const result = await this.databaseService.query<{ id: number }>(
      `INSERT INTO ${this.oauthTable} (user_id, provider, oauth_id) VALUES (${user_id}, '${provider}', '${oauth_id}') RETURNING id;`,
    );
    return result.length === 1 ? result[0].id : null;
  }
}
