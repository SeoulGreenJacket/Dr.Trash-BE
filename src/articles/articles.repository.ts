import { CreateArticleDto } from './dto/create-article.dto';
import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Article } from './entities/article.entity';
import { database } from 'src/common/environments';
import { Order } from './enum/order.enum';
import { ResponseArticle } from './dto/response-article-dto';

@Injectable()
export class ArticlesRepository {
  constructor(private databaseService: DatabaseService) {}

  async create(createArticleDto: CreateArticleDto, authorId: number) {
    const { title, content } = createArticleDto;
    const result = await this.databaseService.query<{ id: number }>(
      `INSERT INTO ${database.tables.article} ("authorId",title,content,"viewCount") VALUES (${authorId},'${title}', '${content}',0)
        RETURNING id;`,
    );

    return result.length === 1 ? result[0].id : null;
  }

  async findAll(orderBy: Order, limit: number) {
    const limitValue = orderBy === 'viewCount' ? limit : 'ALL';
    const result = await this.databaseService.query<Article[]>(`
      SELECT * FROM ${database.tables.article}
      ORDER BY "${orderBy}" DESC
      LIMIT ${limitValue};
    `);
    return result;
  }

  async increaseViewCount(id: number) {
    const result = await this.databaseService.query<{ viewCount: number }>(
      `UPDATE ${database.tables.article} SET "viewCount"="viewCount"+1
        WHERE id=${id} 
        RETURNING "viewCount";`,
    );
    return result.length === 1 ? result[0].viewCount : null;
  }

  async findOne(id: number) {
    const result = await this.databaseService.query<ResponseArticle>(`
      SELECT "authorId","title","content","viewCount","createdAt","updatedAt","name" 
      FROM ${database.tables.article} 
      INNER JOIN ${database.tables.user} 
      ON ${database.tables.article}.authorId=${database.tables.user}.id
      WHERE ${database.tables.article}.id=${id};
    `);
    return result.length === 1 ? result[0] : null;
  }

  async update(id: number, updateArticleDto) {
    const { title, content } = updateArticleDto;
    const result = await this.databaseService.query<Article>(
      `UPDATE ${database.tables.article} SET title='${title}', content='${content}' , "updatedAt"=NOW()
        WHERE id=${id} 
        RETURNING *;`,
    );
    return result.length === 1 ? result[0] : null;
  }

  async remove(id: number) {
    const result = await this.databaseService.query<Article>(
      `DELETE FROM ${database.tables.article} WHERE id=${id} RETURNING id;`,
    );
    return result.length === 1 ? result[0].id : null;
  }
}
