import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from './auth.repository';
import { JwtPayload, JwtTokenResponse } from './dto/jwt-token.dto';
import { v4 as uuid4 } from 'uuid';
import { jwt } from 'src/common/environments';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private authRepository: AuthRepository,
  ) {}

  async login(userId: number): Promise<JwtTokenResponse> {
    const uuid = uuid4();
    const payload: JwtPayload = { uuid, userId };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(
      payload,
      jwt().refreshConfig.signOptions,
    );
    await this.authRepository.createToken(uuid);
    return {
      accessToken,
      refreshToken,
    };
  }

  async logout(uuid: string): Promise<void> {
    await this.authRepository.deleteToken(uuid);
  }

  async refresh(uuid: string, userId: number): Promise<JwtTokenResponse> {
    await this.authRepository.deleteToken(uuid);
    return await this.login(userId);
  }
}
