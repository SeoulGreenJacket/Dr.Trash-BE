import { DatabaseModule } from 'src/database/database.module';
import { ArticlesRepository } from './articles.repository';
import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [ArticlesController],
  providers: [ArticlesService, ArticlesRepository],
})
export class ArticlesModule {}
