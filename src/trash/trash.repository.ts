import { DatabaseService } from 'src/database/database.service';

export class TrashRepository {
  private readonly schema = process.env.DATABASE_APPLICATION_SCHEMA;
  private readonly trashTable = `"${this.schema}"."trash"`;
  private readonly trashcanUsageTable = `"${this.schema}"."trashcanUsage"`;

  constructor(private databaseService: DatabaseService) {}

  async logTrashcanUsage(
    userId: number,
    trashcanId: number,
    open: boolean,
  ): Promise<boolean> {
    const queryResult = await this.databaseService.query<{ id: number }>(`
      INSERT INTO
        ${this.trashcanUsageTable}
        (
          "userId",
          "trashcanId",
          "open"
        )
      VALUES
        (
          ${userId},
          ${trashcanId},
          ${open}
        )
      RETURNING
        id
    ;`);

    return queryResult.length === 1;
  }
}
