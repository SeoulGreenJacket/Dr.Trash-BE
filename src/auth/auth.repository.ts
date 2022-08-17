import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class AuthRepository {
  constructor(private databaseService: DatabaseService) {}
  private readonly schema = process.env.DATABASE_APPLICATION_SCHEMA;
  private readonly tokenTable = `${this.schema}.token`;

  async createToken(uuid: string) {
    const result = await this.databaseService.query<{ id: string }>(`
    INSERT INTO ${this.tokenTable} (id) VALUES ('${uuid}') RETURNING id;
    `);
    return result.length === 1 ? result[0].id : null;
  }

  async deleteToken(uuid: string) {
    const result = await this.databaseService.query<{ id: string }>(`
    DELETE FROM ${this.tokenTable} WHERE id='${uuid}';
    `);
    return result.length === 1 ? result[0].id : null;
  }

  async findToken(uuid: string) {
    const result = await this.databaseService.query<{ id: string }>(`
    SELECT id FROM ${this.tokenTable} WHERE id='${uuid}';
    `);
    return result.length === 1 ? result[0].id : null;
  }
}
