import { JwtPayload } from './dto/jwt-payload.dto';
import { UserPayload, OAuthPayload } from './../users/dto/create-user.dto';
import { DatabaseService } from './../database/database.service';
import { UsersService } from './../users/users.service';
import { Injectable } from '@nestjs/common';
import { v4 as uuid4 } from 'uuid';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from './auth.repository';
import { User } from './../users/entities/user.entity';
import { UserSocialDto } from './dto/user-social.dto';
import { JwtToken } from './dto/jwt-token.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private authRepository: AuthRepository,
    private usersService: UsersService,
    private databaseService: DatabaseService,
  ) {}

  async login(user: User): Promise<JwtToken> {
    const uuid = uuid4();
    const payload: JwtPayload = { uuid, sub: user.id };
    const access_token = this.jwtService.sign(payload);
    const expiresIn = parseInt(process.env.JWT_REFRESH_EXPIRES_IN);
    const refresh_token = this.jwtService.sign(payload, { expiresIn });
    this.authRepository.save(uuid, refresh_token, expiresIn);
    return {
      access_token,
      refresh_token,
    };
  }

  async validateUser(payload: UserSocialDto): Promise<JwtToken> {
    const { oauth_id, provider, image_uri, name } = payload;
    const existedUser: User = await this.databaseService.userFindByOAuth(
      oauth_id,
      provider,
    );
    if (existedUser) {
      return await this.login(existedUser);
    } else {
      const userPayload: UserPayload = { name, image_uri };
      const oAuthPayload: OAuthPayload = { oauth_id, provider };
      const user = await this.usersService.create(userPayload, oAuthPayload);
      return await this.login(user);
    }
  }

  async logout(user: any): Promise<void> {
    await this.authRepository.delete(user.uuid);
  }
}
