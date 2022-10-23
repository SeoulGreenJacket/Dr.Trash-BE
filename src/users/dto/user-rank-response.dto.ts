import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UserRankResponseDto {
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsString()
  userName: string;

  @IsNotEmpty()
  @IsNumber()
  point: number;
}
