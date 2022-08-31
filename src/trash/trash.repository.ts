import { DatabaseService } from 'src/database/database.service';
import { database } from 'src/common/environments';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TrashRepository {
  constructor(private databaseService: DatabaseService) {}

  async logTrashcanUsage(
    userId: number,
    trashcanId: number,
    open: boolean,
  ): Promise<boolean> {
    const queryResult = await this.databaseService.query<{ id: string }>(`
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
          ${open}
        )
      RETURNING
        id
    ;`);

    return queryResult.length === 1;
  }
}
