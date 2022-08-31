import { Type } from 'class-transformer/types/decorators/type.decorator';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Achievement } from '../types/achievement.type';
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
    return Achievement;
  })
  achievement: Achievement[];

  @IsNotEmpty()
  @IsNumber()
  rank: number;
}
