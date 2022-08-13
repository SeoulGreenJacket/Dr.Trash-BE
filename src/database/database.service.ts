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
  schema: string;
  constructor(@Inject(NEST_PGPROMISE_CONNECTION) private readonly pg) {
    this.schema = process.env.DATABASE_APPLICATION_SCHEMA;
  }

  async userCreate(user: CreateUserDto) {
    const { name, image_uri, point } = user;
    return (
      await this.pg.query(
        `INSERT INTO ${this.schema}.user_table (name,image_uri,point) VALUES ('${name}', '${image_uri}', ${point}) RETURNING id;`,
      )
    )[0].id;
  }

  async oauthCreate(oauth: CreateOAuthDto) {
    const { oauth_id, provider, user_id } = oauth;
    await this.pg.query(
      `INSERT INTO ${this.schema}.oauth(user_id, provider, oauth_id) VALUES (${user_id}, '${provider}', '${oauth_id}');`,
    );
  }

  async userCheckByOAuth(oauth_id: string, provider: string): Promise<UserId> {
    return (
      await this.pg.query(
        `SELECT user_id FROM ${this.schema}.oauth WHERE oauth_id='${oauth_id}' AND provider='${provider}';`,
      )
    )[0];
  }

  async userFindByUser_id(user_id: number) {
    const user: User = (
      await this.pg.query(
        `SELECT * FROM ${this.schema}.user_table WHERE id=${user_id};`,
      )
    )[0];

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
