import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UserRankResponseDto {
  @IsNotEmpty()
  @IsString()
  userName: string;

  @IsNotEmpty()
  @IsNumber()
  point: number;
}
