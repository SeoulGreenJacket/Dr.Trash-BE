import { User } from 'src/users/entities/user.entity';
import {
  CreateOAuthDto,
  CreateUserDto,
  UserId,
} from './../users/dto/create-user.dto';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { NEST_PGPROMISE_CONNECTION } from 'nest-pgpromise';

@Injectable()
export class DatabaseService {
  appSchema: string;
  constructor(@Inject(NEST_PGPROMISE_CONNECTION) private readonly pg) {
    this.appSchema = process.env.DATABASE_APP_SCHEMA;
  }

  async userCreate(user: CreateUserDto) {
    const { name, image_uri, point } = user;
    return (
      await this.pg.query(
        `INSERT INTO ${this.appSchema}.user_table (name,image_uri,point) VALUES ('${name}', '${image_uri}', ${point}) RETURNING id;`,
      )
    )[0].id;
  }

  async oauthCreate(oauth: CreateOAuthDto) {
    const { oauth_id, provider, user_id } = oauth;
    await this.pg.query(
      `INSERT INTO ${this.appSchema}.oauth(user_id, provider, oauth_id) VALUES (${user_id}, '${provider}', '${oauth_id}');`,
    );
  }

  async userCheckByOAuth(oauth_id: string, provider: string): Promise<UserId> {
    return (
      await this.pg.query(
        `SELECT user_id FROM ${this.appSchema}.oauth WHERE oauth_id='${oauth_id}' AND provider='${provider}';`,
      )
    )[0];
  }

  async userFindByUser_id(user_id: number) {
    const user: User = (
      await this.pg.query(
        `SELECT * FROM ${this.appSchema}.user_table WHERE id=${user_id};`,
      )
    )[0];

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
