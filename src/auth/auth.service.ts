import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from './auth.repository';
import { JwtPayload } from './types/jwt-token-payload.type';
import { v4 as uuid4 } from 'uuid';
import { JwtTokenResponseDto } from './dto/jwt-token-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private authRepository: AuthRepository,
  ) {}

  async login(userId: number): Promise<JwtTokenResponseDto> {
    const uuid = uuid4();
    const payload: JwtPayload = { uuid, userId: userId };
    const accessToken = this.jwtService.sign(payload);
    const expiresIn = parseInt(process.env.JWT_REFRESH_EXPIRES_IN);
    const refreshToken = this.jwtService.sign(payload, { expiresIn });
    await this.authRepository.createToken(uuid);
    return {
      accessToken,
      refreshToken,
    };
  }

  async logout(uuid: string): Promise<void> {
    await this.authRepository.deleteToken(uuid);
  }

  async refresh(uuid: string, userId: number): Promise<JwtTokenResponseDto> {
    await this.authRepository.deleteToken(uuid);
    return await this.login(userId);
  }
}
