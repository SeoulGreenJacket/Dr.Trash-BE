import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { database } from 'src/common/environments';

@Injectable()
export class AuthRepository {
  constructor(private databaseService: DatabaseService) {}

  async createToken(uuid: string) {
    const result = await this.databaseService.query<{ id: string }>(`
    INSERT INTO ${database.tables.token} (id) VALUES ('${uuid}') RETURNING id;
    `);
    return result.length === 1 ? result[0].id : null;
  }

  async deleteToken(uuid: string) {
    const result = await this.databaseService.query<{ id: string }>(`
    DELETE FROM ${database.tables.token} WHERE id='${uuid}';
    `);
    return result.length === 1 ? result[0].id : null;
  }

  async findToken(uuid: string) {
    const result = await this.databaseService.query<{ id: string }>(`
    SELECT id FROM ${database.tables.token} WHERE id='${uuid}';
    `);
    return result.length === 1 ? result[0].id : null;
  }
}
