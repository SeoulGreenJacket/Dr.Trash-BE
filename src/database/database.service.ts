import { CreateOAuthDto, CreateUserDto } from './../users/dto/create-user.dto';
import { Inject, Injectable } from '@nestjs/common';
import { NEST_PGPROMISE_CONNECTION } from 'nest-pgpromise';

@Injectable()
export class DatabaseService {
  constructor(@Inject(NEST_PGPROMISE_CONNECTION) private readonly pg) {}

  async query(sql: string) {
    return await this.pg.query(sql);
  }

  async userCreate(user: CreateUserDto) {
    const { name, image_uri, point } = user;
    return await this.pg.query(
      `INSERT INTO application.user_table (name,image_uri,point) VALUES ('${name}', '${image_uri}', ${point}) RETURNING id;`,
    );
  }

  async oauthCreate(oauth: CreateOAuthDto) {
    const { id, provider, user_id } = oauth;
    return await this.pg.query(
      `INSERT INTO oauth(user_id, provider, id) VALUES (${user_id}, ${id}, ${provider});`,
    );
  }

  async userFindByOAuth(id: string, provider: string) {
    return await this.pg.query(
      `SELECT * FROM user WHERE id=(SELECT user_id FROM oauth WHERE id=${id} AND provider=${provider});`,
    );
  }

  async userFindByUser_id(user_id: string) {
    return await this.pg.query(`SELECT * FROM user WHERE id=${user_id};`);
  }
}
