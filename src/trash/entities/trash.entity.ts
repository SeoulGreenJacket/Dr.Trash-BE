import { IsInt, IsEnum, IsDate, IsBoolean } from 'class-validator';

export enum TrashType {
  CAN = 'can',
  PET = 'pet',
  PAPER = 'paper',
  PLASTIC = 'plastic',
}

export class Trash {
  @IsInt()
  id: number;

  @IsInt()
  trashcanId: number;

  @IsInt()
  userId: number;

  @IsEnum(TrashType)
  type: TrashType;

  @IsDate()
  time: Date;

  @IsBoolean()
  ok: boolean;
}
