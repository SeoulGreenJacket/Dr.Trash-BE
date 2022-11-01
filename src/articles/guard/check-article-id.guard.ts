import { ArticlesRepository } from './../articles.repository';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class CheckArticleIdGuard implements CanActivate {
  constructor(private articlesRepository: ArticlesRepository) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const authorId = await this.articlesRepository.findAuthorIdByid(
      request.params.id,
    );

    return user.id === authorId;
  }
}
