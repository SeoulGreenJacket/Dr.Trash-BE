import { DatabaseService } from 'src/database/database.service';
import { database } from 'src/common/environments';
import { ConflictException, Injectable } from '@nestjs/common';

@Injectable()
export class TrashRepository {
  constructor(private databaseService: DatabaseService) {}

  async getLastUsage(userId: number) {
    const queryResult = await this.databaseService.query<{
      id: number;
      userId: number;
      trashcanId: number;
      beginAt: Date;
      endAt: Date;
    }>(`
      SELECT
        "id",
        "userId",
        "trashcanId",
        "beginAt",
        "endAt"
      FROM
        ${database.tables.trashcanUsage}
      WHERE
        "userId" = ${userId}
        AND
        "endAt" IS NULL
    ;`);

    if (queryResult.length > 2) {
      throw new ConflictException('More than one trashcan is open');
    }
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
          "trashcanId"
        )
      VALUES
        (
          ${userId},
          ${trashcanId}
        )
      RETURNING
        id
    ;`);

    return queryResult.length === 1 ? +queryResult[0].id : null;
  }

  async closeTrashcan(usageId: number) {
    const queryResult = await this.databaseService.query(`
      UPDATE
        ${database.tables.trashcanUsage}
      SET
        "endAt" = now()
      WHERE
        id = ${usageId}
    ;`);
    return queryResult;
  }

  async findUsages(userId: number, from: Date, to: Date) {
    const queryResult = await this.databaseService.query<{
      id: number;
      userId: number;
      trashcanId: number;
      beginAt: Date;
      endAt: Date;
    }>(`
      SELECT
        *
      FROM
        ${database.tables.trashcanUsage}
      WHERE
        "userId" = ${userId}
        AND
        "beginAt" BETWEEN '${from.toISOString()}' AND '${to.toISOString()}'
    ;`);

    return queryResult;
  }

  async findOneUsage(id: number) {
    const queryResult = await this.databaseService.query<{
      id: number;
      userId: number;
      trashcanId: number;
      beginAt: Date;
      endAt: Date;
    }>(`
      SELECT
        *
      FROM
        ${database.tables.trashcanUsage}
      WHERE
        "id" = ${id}
    ;`);

    return queryResult.length === 1 ? queryResult[0] : null;
  }

  async countTrash(userId: number, from: Date, to: Date) {
    const { trash, trashcan, trashcanUsage } = database.tables;
    const queryResult = await this.databaseService.query<{
      trashType: string;
      trashcanType: string;
      count: string;
    }>(`
    SELECT
      ${trash}.type AS "trashType",
      ${trashcan}.type AS "trashcanType",
      COUNT(*) AS "count"
    FROM
      ${trash}
      JOIN
      ${trashcanUsage}
      ON
      ${trash}."usageId" = ${trashcanUsage}.id
      JOIN
      ${trashcan}
      ON
      ${trashcanUsage}."trashcanId" = ${trashcan}.id
    WHERE
      ${trash}.at BETWEEN '${from.toISOString()}' AND '${to.toISOString()}'
      AND
      ${trashcanUsage}."userId" = ${userId}
    GROUP BY
      ${trash}.type,
      ${trashcan}.type
    `);
    return queryResult.map((row) => ({
      trashType: row.trashType,
      trashcanType: row.trashcanType,
      count: +row.count,
    }));
  }
}
