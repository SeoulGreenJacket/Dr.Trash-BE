import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Query,
  ParseEnumPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AccessUser } from 'src/auth/decorator/access-user.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { User } from 'src/users/entities/user.entity';
import { CheckUserIdGuard } from 'src/users/guard/check-user-id.guard';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Order } from './enum/order.enum';

@ApiBearerAuth()
@ApiTags('Article')
@UseGuards(JwtAuthGuard)
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  create(
    @Body() createArticleDto: CreateArticleDto,
    @AccessUser() author: User,
  ) {
    return this.articlesService.create(createArticleDto, author.id);
  }

  @Get()
  findAll(
    @Query('orderBy', new DefaultValuePipe(Order.ID), new ParseEnumPipe(Order))
    orderBy: Order,
    @Query('limit', new DefaultValuePipe(3), ParseIntPipe) limit: number,
  ) {
    return this.articlesService.findAll(orderBy, limit);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.articlesService.findOne(id);
  }

  @UseGuards(CheckUserIdGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    return this.articlesService.update(id, updateArticleDto);
  }

  @UseGuards(CheckUserIdGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.articlesService.remove(id);
  }
}
