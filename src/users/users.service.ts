import { AchievementsRepository } from 'src/achievements/achievements.repository';
import { CacheService } from './../cache/cache.service';
import { User } from 'src/users/entities/user.entity';
import { UsersRepository } from './users.repository';
import { Injectable } from '@nestjs/common';
import { UserResponseDto } from './dto/user-response.dto';
import { UserUpdateDto } from './dto/user-update.dto';
import { UserRankResponseDto } from './dto/user-rank-response.dto';
import { Grade } from './types/grade.enum';
import { UserAchievement } from 'src/achievements/entity/user-achievement.entity';

@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UsersRepository,
    private cacheService: CacheService,
    private achievementsRepository: AchievementsRepository,
  ) {}

  async create(kakaoId: bigint, thumbnail: string, name: string) {
    const user: User = await this.usersRepository.create(
      name,
      thumbnail,
      kakaoId,
    );
    await this.cacheService.addUserPoint(user.id, user.point);
    return user;
  }

  async findOne(id: number): Promise<UserResponseDto> {
    const { name, thumbnail, point } = await this.usersRepository.findByUserId(
      id,
    );
    const userGrade: Grade =
      point >= 1000
        ? Grade.RecycleMaster
        : point >= 500
        ? Grade.TheVolunteer
        : Grade.TheBeginner;

    const achievement: UserAchievement[] =
      await this.achievementsRepository.getUserAchievements(id);

    const rank = await this.cacheService.getUserRank(id);

    return { id, name, thumbnail, point, userGrade, achievement, rank };
  }

  async findRankAll(
    limit: number,
    offset: number,
  ): Promise<UserRankResponseDto[]> {
    const userRanklist = await this.cacheService.getUserRankList(limit, offset);

    return await Promise.all(
      userRanklist.map(async ({ score: point, value: userId }) => {
        const { name } = await this.usersRepository.findByUserId(userId);
        return { userId, point, userName: name };
      }),
    );
  }

  async update(userUpdateDto: UserUpdateDto, user: User) {
    const updateUser = { ...user, ...userUpdateDto };
    return await this.usersRepository.update(
      updateUser.name,
      updateUser.thumbnail,
      updateUser.id,
    );
  }

  async delete(id: number) {
    return await this.usersRepository.delete(id);
  }

  async countUserTrash(id: number) {
    return await this.usersRepository.countUserTrash(id);
  }
}
