import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateTrashcanDto } from './dto/create-trashcan.dto';
import { UpdateTrashcanDto } from './dto/update-trashcan.dto';
import { Trashcan } from './entities/trashcan.entity';
import { database } from 'src/common/environments';

@Injectable()
export class TrashcansRepository {
  private readonly trashcanTable = database.tables.trashcan;
  private readonly trashcanCodeTable = database.tables.trashcanCode;

  constructor(private readonly databaseService: DatabaseService) {}

  async checkCode(code: string): Promise<boolean> {
    const queryResult = await this.databaseService.query<{ count: string }>(`
      SELECT
        COUNT(1)
      FROM
        ${this.trashcanCodeTable}
      WHERE
        code = '${code}'
    ;`);

    return +queryResult[0].count === 1;
  }

  async create(userId: number, dto: CreateTrashcanDto): Promise<boolean> {
    const queryResult = await this.databaseService.query<{ id: number }>(`
      INSERT INTO
        ${this.trashcanTable}
        (
          "managerId",
          "code",
          "name",
          "phoneNumber",
          "latitude",
          "longitude"
        )
      VALUES
        (
          '${userId}',
          '${dto.code}',
          '${dto.name}',
          '${dto.phone}',
          '${dto.latitude}',
          '${dto.longitude}'
        )
      RETURNING
        id
    ;`);

    return queryResult.length === 1;
  }

  async findAll(limit: number, offset: number): Promise<Trashcan[]> {
    const queryResult = await this.databaseService.query<Trashcan>(`
      SELECT
        "id",
        "managerId",
        "code",
        "name",
        "phoneNumber",
        "latitude",
        "longitude"
      FROM
        ${this.trashcanTable}
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
        "phoneNumber",
        "latitude",
        "longitude"
      FROM
        ${this.trashcanTable}
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
        "phoneNumber",
        "latitude",
        "longitude"
      FROM
        ${this.trashcanTable}
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
        "phoneNumber",
        "latitude",
        "longitude"
      FROM
        ${this.trashcanTable}
      WHERE
        code = '${code}'
    ;`);

    return queryResult.length === 1 ? queryResult[0] : null;
  }

  async update(id: number, dto: UpdateTrashcanDto): Promise<boolean> {
    const queryResult = await this.databaseService.query<{ id: number }>(`
      UPDATE
        ${this.trashcanTable}
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
        ${this.trashcanTable}
      WHERE
        id = '${id}'
      RETURNING
        id
    ;`);

    return queryResult.length === 1;
  }
}
