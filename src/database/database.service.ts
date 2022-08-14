import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class DatabaseService {
  constructor(@Inject('DATABASE_POOL') private pool: Pool) {}

  async query<DataType>(query: string, values?: any[]): Promise<DataType[]> {
    const result = await this.pool.query<DataType>(query, values);
    return result.rows;
  }
}
