import {
  IsUUID,
  MinLength,
  MaxLength,
  IsMobilePhone,
  IsLatitude,
  IsLongitude,
} from 'class-validator';

export class CreateTrashcanDto {
  @IsUUID('4')
  code: string;

  @MinLength(1)
  @MaxLength(32)
  name: string;

  @IsMobilePhone('ko-KR')
  phone: string;

  @IsLatitude()
  latitude: number;

  @IsLongitude()
  longitude: number;
}
