import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { map } from 'rxjs';
import { AchievementsService } from './achievements.service';

@Injectable()
export class AchievementInterceptor {
  constructor(
    @Inject(AchievementsService)
    private readonly achievementsService: AchievementsService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    if (context.getType() === 'http') {
      const userId = context.switchToHttp().getRequest().user?.id;
      return next.handle().pipe(
        map(async (data) => {
          return {
            data,
            achievement: userId
              ? await this.achievementsService.getNotifications(userId)
              : null,
          };
        }),
      );
    }
  }
}
