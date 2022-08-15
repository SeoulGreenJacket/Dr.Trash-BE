import { DatabaseService } from '../database/database.service';
import { User } from './entities/user.entity';

export class UsersRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  private readonly schemaName = process.env.DATABASE_SCHEMA;
  private readonly userTable = `${this.schemaName}.users`;
  private readonly oauthTable = `${this.schemaName}.oauth`;

  async create(name: string, image_uri: string): Promise<number> {
    const queryResult = await this.databaseService.query<{ id: number }>(`
      INSERT INTO
        ${this.schemaName}.${this.userTable}(name, image_uri)
      VALUES
        ('${name}', '${image_uri}')
      RETURNING id;
    `);
    return queryResult.length === 1 ? queryResult[0].id : null;
  }

  async createOAuth(
    id: number,
    provider: string,
    oauthId: string,
  ): Promise<number> {
    const queryResult = await this.databaseService.query<{ id: number }>(`
      INSERT INTO
        ${this.schemaName}.${this.userTable}(id, provider, oauth_id)
      VALUES
        ('${id}', '${provider}', '${oauthId}')
      RETURNING id;
    `);
    return queryResult.length === 1 ? queryResult[0].id : null;
  }

  async findById(id: number): Promise<User> {
    const queryResult = await this.databaseService.query<User>(`
      SELECT
        id, name, thumnail, point
      FROM
        ${this.schemaName}.${this.userTable}
      WHERE id = ${id};
    `);

    return queryResult.length === 1 ? queryResult[0] : null;
  }

  async findByOAuth(provider: string, oauthId: string): Promise<User> {
    const queryResult = await this.databaseService.query<User>(`
      SELECT
        id, name, thumnail, point
      FROM
        ${this.userTable}
        INNER JOIN
        ${this.oauthTable}
        ON
        ${this.userTable}.id = ${this.oauthTable}.user_id
      WHERE provider = ${provider} AND oauth_id = ${oauthId};
    `);

    return queryResult.length === 1 ? queryResult[0] : null;
  }
}
