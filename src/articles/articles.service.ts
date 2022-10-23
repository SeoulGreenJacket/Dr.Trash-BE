import { Injectable } from '@nestjs/common';
import { ArticlesRepository } from './articles.repository';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Injectable()
export class ArticlesService {
  constructor(private readonly articlesRepository: ArticlesRepository) {}

  async create(createArticleDto: CreateArticleDto, authorId: number) {
    return await this.articlesRepository.create(createArticleDto, authorId);
  }

  async findOne(id: number) {
    await this.articlesRepository.increaseViewCount(id);
    return await this.articlesRepository.findOne(id);
  }

  async findAll(orderBy, limit) {
    return await this.articlesRepository.findAll(orderBy, limit);
  }

  async update(id: number, updateArticleDto: UpdateArticleDto) {
    return await this.articlesRepository.update(id, updateArticleDto);
  }

  async remove(id: number) {
    return await this.articlesRepository.remove(id);
  }
}
