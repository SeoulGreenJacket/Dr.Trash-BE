import {
  IsInt,
  IsUUID,
  MinLength,
  MaxLength,
  IsMobilePhone,
  IsLatitude,
  IsLongitude,
  IsDate,
} from 'class-validator';

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

  @IsMobilePhone('ko-KR')
  phoneNumber: string;

  @IsLatitude()
  latitude: number;

  @IsLongitude()
  longitude: number;

  @IsDate()
  createdAt: Date;
}
