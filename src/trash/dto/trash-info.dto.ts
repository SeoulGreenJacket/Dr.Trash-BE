import { IsInt } from 'class-validator';

export class TrashInfo {
  @IsInt()
  success: number;

  @IsInt()
  failure: number;
}
