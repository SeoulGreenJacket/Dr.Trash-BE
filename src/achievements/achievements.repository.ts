import { Injectable } from '@nestjs/common';
import { database } from 'src/common/environments';
import { DatabaseService } from 'src/database/database.service';
import { Achievement } from './entity/achievement.entity';
import { UserAchievement } from './entity/user-achievement.entity';

@Injectable()
export class AchievementsRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async getAchievement(id: number): Promise<Achievement> {
    const query = `
      SELECT
        "id",
        "name",
        "description",
        "imageUri"
      FROM
        ${database.tables.achievement}
      WHERE
        id = $1
    `;

    const result = await this.databaseService.query<{
      id: string;
      name: string;
      description: string;
      imageUri: string;
    }>(query, [id]);

    if (result.length === 0) {
      return null;
    } else {
      const { id, ...ret } = result[0];
      return {
        id: parseInt(id),
        ...ret,
      };
    }
  }

  async getAchievements(): Promise<Achievement[]> {
    const query = `
      SELECT
        "id",
        "name",
        "description",
        "imageUri"
      FROM
        ${database.tables.achievement}
    `;
    const result = await this.databaseService.query<{
      id: string;
      name: string;
      description: string;
      imageUri: string;
    }>(query);
    return result.map((achievement) => {
      const { id, ...ret } = achievement;
      return {
        id: parseInt(id),
        ...ret,
      };
    });
  }

  async getUserAchievements(userId: number): Promise<UserAchievement[]> {
    const query = `
      SELECT
        "id",
        "name",
        "description",
        "imageUri",
        "achievedAt"
      FROM
        ${database.tables.achievement}
        LEFT JOIN
        ${database.tables.achiever}
        ON
        ${database.tables.achievement}."id" = ${database.tables.achiever}."achievementId"
        AND
        ${database.tables.achiever}."userId" = $1
    `;

    const result = await this.databaseService.query<{
      id: string;
      name: string;
      description: string;
      imageUri: string;
      achievedAt: Date;
    }>(query, [userId]);

    return result.map((achievement) => {
      const { id, ...ret } = achievement;
      return {
        id: parseInt(id),
        ...ret,
      };
    });
  }

  async getAchievableIds(userId: number): Promise<number[]> {
    const query = `
      SELECT
        id
      FROM
        ${database.tables.achievement}
        LEFT JOIN
        ${database.tables.achiever}
        ON
        ${database.tables.achievement}."id" = ${database.tables.achiever}."achievementId"
        AND
        ${database.tables.achiever}."userId" = $1
      WHERE
        "achievedAt" IS NULL
    `;
    const result = await this.databaseService.query<{ id: string }>(query, [
      userId,
    ]);
    return result.map((row) => {
      return parseInt(row.id);
    });
  }

  async isAchieved(userId: number, achievementId: number): Promise<boolean> {
    const query = `
      SELECT
        "achievedAt"
      FROM
        ${database.tables.achiever}
      WHERE
        "userId" = $1
        AND
        "achievementId" = $2
    `;
    const result = await this.databaseService.query<{ achievedAt: Date }>(
      query,
      [userId, achievementId],
    );
    return result.length === 1;
  }

  async unlock(userId: number, achievementId: number): Promise<void> {
    const query = `
      INSERT INTO
        ${database.tables.achiever}
        ("userId", "achievementId", "achievedAt")
      VALUES
        ($1, $2, NOW())
    `;
    await this.databaseService.query(query, [userId, achievementId]);
  }
}
