import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { AchievementsRepository } from './achievements.repository';

@Controller('achievements')
export class AchievementsController {
  constructor(
    private readonly achievementsRepository: AchievementsRepository,
  ) {}

  @Get()
  async getAchievements() {
    return this.achievementsRepository.getAchievements();
  }

  @Get(':id')
  async getAchievement(@Param('id', ParseIntPipe) id) {
    return this.achievementsRepository.getAchievement(id);
  }
}
