import { DatabaseService } from 'src/database/database.service';
import { database } from 'src/common/environments';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TrashRepository {
  constructor(private databaseService: DatabaseService) {}

  async getLastUsage(userId: number) {
    const queryResult = await this.databaseService.query<{
      id: number;
      code: string;
      type: string;
      at: Date;
    }>(`
      SELECT
        *
      FROM
        ${database.tables.trashcanUsage}
      WHERE
        "userId" = ${userId}
        AND
        "close" IS NULL
    ;`);

    return queryResult.length === 1 ? queryResult[0] : null;
  }

  async createTrashcanUsage(
    userId: number,
    trashcanId: number,
  ): Promise<number> {
    const queryResult = await this.databaseService.query<{ id: number }>(`
      INSERT INTO
        ${database.tables.trashcanUsage}
        (
          "userId",
          "trashcanId",
          "open"
        )
      VALUES
        (
          ${userId},
          ${trashcanId},
          now()
        )
      RETURNING
        id
    ;`);

    return queryResult.length === 1 ? +queryResult[0].id : null;
  }

  async updateTrashcanUsage(usageId: number) {
    const queryResult = await this.databaseService.query<{
      userId: number;
      open: Date;
      close: Date;
    }>(`
      UPDATE
        ${database.tables.trashcanUsage}
      SET
        "close" = now()
      WHERE
        id = ${usageId}
      RETURNING
        "userId","open","close"
    ;`);

    return queryResult.length === 1 ? queryResult[0] : null;
  }
}
