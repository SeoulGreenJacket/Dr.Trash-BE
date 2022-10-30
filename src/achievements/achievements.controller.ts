import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { AchievementsRepository } from './achievements.repository';

@ApiTags('Achievements')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
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
