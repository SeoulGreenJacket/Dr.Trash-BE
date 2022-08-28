import { DatabaseService } from 'src/database/database.service';

export class TrashRepository {
  constructor(private databaseService: DatabaseService) {}
  private readonly schema = process.env.DATABASE_APPLICATION_SCHEMA;
  private readonly trashTable = `"${this.schema}"."trash"`;
}
