import { PartialType } from '@nestjs/swagger';
import { Achievement } from './achievement.entity';

export class UserAchievement extends PartialType(Achievement) {
  achievedAt: Date;
}
