import {
  IsInt,
  IsUUID,
  MinLength,
  MaxLength,
  IsMobilePhone,
  IsLatitude,
  IsLongitude,
  IsDate,
  IsEnum,
} from 'class-validator';
import { TrashLog } from 'src/trash/dto/trash-log.dto';

export class Trashcan {
  @IsInt()
  id: number;

  @IsInt()
  managerId: number;

  @IsUUID('4')
  code: string;

  @MinLength(1)
  @MaxLength(32)
  name: string;

  @IsEnum(Object.keys(TrashLog))
  type: string;

  @IsMobilePhone('ko-KR')
  phoneNumber: string;

  @IsLatitude()
  latitude: number;

  @IsLongitude()
  longitude: number;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}
