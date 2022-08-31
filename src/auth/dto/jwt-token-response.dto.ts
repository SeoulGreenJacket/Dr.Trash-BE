import { IsJWT, IsNotEmpty } from 'class-validator';

export class JwtTokenResponseDto {
  @IsNotEmpty()
  @IsJWT()
  accessToken: string;
  @IsNotEmpty()
  @IsJWT()
  refreshToken: string;
}
