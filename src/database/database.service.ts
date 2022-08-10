import { CreateOauthDto, CreateUserDto } from './../users/dto/create-user.dto';
import { Inject, Injectable } from '@nestjs/common';
import { NEST_PGPROMISE_CONNECTION } from 'nest-pgpromise';

@Injectable()
export class DatabaseService {
  constructor(@Inject(NEST_PGPROMISE_CONNECTION) private readonly pg) {}

  async query(sql: string) {
    return await this.pg.query(sql);
  }

  userCreate(user: CreateUserDto) {
    const { name, thumnail, point } = user;
    return this.pg.query(
      `INSERT INTO users(name, thumnail, point) VALUES (${name}, ${thumnail}, ${point}) RETURNING id;`,
    );
  }

  oauthCreate(oauth: CreateOauthDto) {
    const { id, provider, user_id } = oauth;
    return this.pg.query(
      `INSERT INTO oauth(user_id, provider, id) VALUES (${user_id}, ${id}, ${provider});`,
    );
  }

  userFindByOauth(id: string, provider: string) {
    return this.pg.query(
      `SELECT * FROM users WHERE id=(SELECT user_id FROM oauth WHERE id=${id} AND provider=${provider};);`,
    );
  }

  userFindByUser_id(user_id: string) {
    return this.pg.query(`SELECT * FROM users WHERE id=${user_id};`);
  }
}
