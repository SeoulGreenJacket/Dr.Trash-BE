import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateTrashcanDto } from './dto/create-trashcan.dto';
import { UpdateTrashcanDto } from './dto/update-trashcan.dto';
import { Trashcan } from './entities/trashcan.entity';
import { database } from 'src/common/environments';

@Injectable()
export class TrashcansRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async checkCode(code: string): Promise<boolean> {
    const queryResult = await this.databaseService.query<{ count: string }>(`
      SELECT
        COUNT(1)
      FROM
        ${database.tables.trashcanCode}
      WHERE
        code = '${code}'
    ;`);

    return +queryResult[0].count === 1;
  }

  async getCode(id: number): Promise<string> {
    const queryResult = await this.databaseService.query<{ code: string }>(`
      SELECT
        code
      FROM
        ${database.tables.trashcan}
      WHERE
        id = '${id}'
    ;`);

    return queryResult.length === 1 ? queryResult[0].code : null;
  }

  async create(userId: number, dto: CreateTrashcanDto): Promise<boolean> {
    const queryResult = await this.databaseService.query<{ id: number }>(`
      INSERT INTO
        ${database.tables.trashcan}
        (
          "managerId",
          "code",
          "name",
          "type",
          "phoneNumber",
          "latitude",
          "longitude"
        )
      VALUES
        (
          '${userId}',
          '${dto.code}',
          '${dto.name}',
          '${dto.type}',
          '${dto.phone}',
          '${dto.latitude}',
          '${dto.longitude}'
        )
      RETURNING
        id
    ;`);

    return queryResult.length === 1;
  }

  async findAll(
    limit: number,
    offset: number,
    managerId: number,
  ): Promise<Trashcan[]> {
    const queryResult = await this.databaseService.query<Trashcan>(`
      SELECT
        "id",
        "managerId",
        "code",
        "name",
        "type",
        "phoneNumber",
        "latitude",
        "longitude"
      FROM
        ${database.tables.trashcan}
      ${managerId === 0 ? '' : `WHERE "managerId" = '${managerId}'`}
      LIMIT
        ${limit}
      OFFSET
        ${offset}
    ;`);

    return queryResult;
  }

  async findByManagerId(userId: number): Promise<Trashcan[]> {
    const queryResult = await this.databaseService.query<Trashcan>(`
      SELECT
        "id",
        "managerId",
        "code",
        "name",
        "type",
        "phoneNumber",
        "latitude",
        "longitude"
      FROM
        ${database.tables.trashcan}
      WHERE
        "managerId" = '${userId}'
    ;`);

    return queryResult;
  }

  async findById(id: number): Promise<Trashcan> {
    const queryResult = await this.databaseService.query<Trashcan>(`
      SELECT
        "id",
        "managerId",
        "code",
        "name",
        "type",
        "phoneNumber",
        "latitude",
        "longitude"
      FROM
        ${database.tables.trashcan}
      WHERE
        id = '${id}'
    ;`);

    return queryResult.length === 1 ? queryResult[0] : null;
  }

  async findByCode(code: string): Promise<Trashcan> {
    const queryResult = await this.databaseService.query<Trashcan>(`
      SELECT
        "id",
        "managerId",
        "code",
        "name",
        "type",
        "phoneNumber",
        "latitude",
        "longitude"
      FROM
        ${database.tables.trashcan}
      WHERE
        code = '${code}'
    ;`);

    return queryResult.length === 1 ? queryResult[0] : null;
  }

  async update(id: number, dto: UpdateTrashcanDto): Promise<boolean> {
    const queryResult = await this.databaseService.query<{ id: number }>(`
      UPDATE
        ${database.tables.trashcan}
      SET
        ${dto.name ? `"name" = '${dto.name}',` : ''}
        ${dto.phone ? `"phoneNumber" = '${dto.phone}',` : ''}
        ${dto.latitude ? `"latitude" = '${dto.latitude}',` : ''}
        ${dto.longitude ? `"longitude" = '${dto.longitude}',` : ''}
        "updatedAt" = NOW()
      WHERE
        id = '${id}'
      RETURNING
        id
    ;`);

    return queryResult.length === 1;
  }

  async remove(id: number): Promise<boolean> {
    const queryResult = await this.databaseService.query<{ id: number }>(`
      DELETE FROM
        ${database.tables.trashcan}
      WHERE
        id = '${id}'
      RETURNING
        id
    ;`);

    return queryResult.length === 1;
  }
}
