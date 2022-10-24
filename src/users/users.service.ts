import { AchievementsRepository } from 'src/achievements/achievements.repository';
import { User } from 'src/users/entities/user.entity';
import { UsersRepository } from './users.repository';
import { Injectable } from '@nestjs/common';
import { UserResponseDto } from './dto/user-response.dto';
import { UserRankResponseDto } from './dto/user-rank-response.dto';
import { Grade } from './types/grade.enum';
import { UserAchievement } from 'src/achievements/entity/user-achievement.entity';

@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UsersRepository,
    private achievementsRepository: AchievementsRepository,
  ) {}

  async create(kakaoId: bigint, thumbnail: string, name: string) {
    const user: User = await this.usersRepository.create(
      name,
      thumbnail,
      kakaoId,
    );
    return user;
  }

  async findOne(id: number): Promise<UserResponseDto> {
    const { name, thumbnail, point } = await this.usersRepository.findOne({
      id,
    });
    const rank = await this.usersRepository.findRank(id);

    const achievement: UserAchievement[] =
      await this.achievementsRepository.getUserAchievements(id);

    return {
      id,
      name,
      thumbnail,
      point,
      userGrade:
        point >= 1000
          ? Grade.RecycleMaster
          : point >= 500
          ? Grade.TheVolunteer
          : Grade.TheBeginner,
      achievement,
      rank,
    };
  }

  async findRank(id: number) {
    return await this.usersRepository.findRank(id);
  }

  async findRankAll(
    limit: number,
    offset: number,
  ): Promise<UserRankResponseDto[]> {
    const userList = await this.usersRepository.findRankAll(limit, offset);
    return userList.map((user) => {
      return {
        userId: user.id,
        userName: user.name,
        point: user.point,
      };
    });
  }

  async update(
    id: number,
    values: { [key: string]: string | number | bigint },
  ) {
    return await this.usersRepository.update(id, values);
  }

  async delete(id: number) {
    return await this.usersRepository.delete(id);
  }

  async countUserTrashTrial(id: number) {
    return await this.usersRepository.countUserTrashTrial(id);
  }
}
