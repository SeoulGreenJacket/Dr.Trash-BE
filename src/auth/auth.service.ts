import { UsersRepository } from './../users/users.repository';
import { JwtPayload } from './dto/jwt-payload.dto';
import { UsersService } from './../users/users.service';
import { Injectable } from '@nestjs/common';
import { v4 as uuid4 } from 'uuid';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from './auth.repository';
import { JwtToken } from './dto/jwt-token.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private authRepository: AuthRepository,
    private usersService: UsersService,
    private usersRepository: UsersRepository,
  ) {}

  async login(userId: number): Promise<JwtToken> {
    const uuid = uuid4();
    const payload: JwtPayload = { uuid, sub: userId };
    const accessToken = this.jwtService.sign(payload);
    const expiresIn = parseInt(process.env.JWT_REFRESH_EXPIRES_IN);
    const refreshToken = this.jwtService.sign(payload, { expiresIn });
    this.authRepository.save(uuid, refreshToken, expiresIn);
    return {
      accessToken,
      refreshToken,
    };
  }

  async logout(user: any): Promise<void> {
    await this.authRepository.delete(user.uuid);
  }
}
