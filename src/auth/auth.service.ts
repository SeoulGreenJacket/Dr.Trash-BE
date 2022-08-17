import { UsersRepository } from './../users/users.repository';
import { UsersService } from './../users/users.service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from './auth.repository';
import { JwtPayload, JwtTokenResponse } from './dto/jwt-token.dto';
import { v4 as uuid4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private authRepository: AuthRepository,
    private usersService: UsersService,
    private usersRepository: UsersRepository,
  ) {}

  async login(userId: number): Promise<JwtTokenResponse> {
    const uuid = uuid4();
    const payload: JwtPayload = { uuid, sub: userId };
    const accessToken = this.jwtService.sign(payload);
    const expiresIn = parseInt(process.env.JWT_REFRESH_EXPIRES_IN);
    const refreshToken = this.jwtService.sign(payload, { expiresIn });
    await this.authRepository.saveToken(uuid);
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
