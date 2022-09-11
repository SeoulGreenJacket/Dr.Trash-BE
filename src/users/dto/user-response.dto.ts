import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { UserAchievement } from 'src/achievements/entity/user-achievement.entity';
import { Grade } from '../types/grade.enum';

export class UserResponseDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  thumbnail: string;

  @IsNotEmpty()
  @IsNumber()
  point: number;

  @IsNotEmpty()
  @IsEnum(Grade)
  userGrade: Grade;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => {
    return UserAchievement;
  })
  achievement: UserAchievement[];

  @IsNotEmpty()
  @IsNumber()
  rank: number;
}
