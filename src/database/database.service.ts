import { CreateOAuthDto, CreateUserDto } from './../users/dto/create-user.dto';
import { Inject, Injectable } from '@nestjs/common';
import { NEST_PGPROMISE_CONNECTION } from 'nest-pgpromise';

@Injectable()
export class DatabaseService {
  appSchema: string;
  constructor(@Inject(NEST_PGPROMISE_CONNECTION) private readonly pg) {
    this.appSchema = process.env.DATABASE_APP_SCHEMA;
  }

  async userCreate(user: CreateUserDto) {
    const { name, image_uri, point } = user;
    return await this.pg.query(
      `INSERT INTO ${this.appSchema}.user_table (name,image_uri,point) VALUES ('${name}', '${image_uri}', ${point}) RETURNING id;`,
    );
  }

  async oauthCreate(oauth: CreateOAuthDto) {
    const { oauth_id, provider, user_id } = oauth;
    return await this.pg.query(
      `INSERT INTO ${this.appSchema}.oauth(user_id, provider, oauth_id) VALUES (${user_id}, '${provider}', '${oauth_id}');`,
    );
  }

  async userFindByOAuth(oauth_id: string, provider: string) {
    const { user_id } = (
      await this.pg.query(
        `SELECT user_id FROM ${this.appSchema}.oauth WHERE oauth_id='${oauth_id}' AND provider='${provider}';`,
      )
    )[0];
    return (
      await this.pg.query(
        `SELECT * FROM ${this.appSchema}.user_table WHERE id=${user_id};`,
      )
    )[0];
  }

  async userFindByUser_id(user_id: number) {
    return (
      await this.pg.query(
        `SELECT * FROM ${this.appSchema}.user_table WHERE id=${user_id};`,
      )
    )[0];
  }
}
