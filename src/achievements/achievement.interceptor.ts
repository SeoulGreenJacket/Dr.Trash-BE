import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { map } from 'rxjs';
import { CacheService } from 'src/cache/cache.service';

@Injectable()
export class AchievementInterceptor {
  constructor(
    @Inject(CacheService) private readonly cacheService: CacheService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    if (context.getType() === 'http') {
      const userId = context.switchToHttp().getRequest().user?.id;
      return next.handle().pipe(
        map(async (data) => {
          return {
            data,
            achievement: userId
              ? await this.cacheService.getAchievementNotifications(userId)
              : null,
          };
        }),
      );
    }
  }
}
