import { UsersService } from './../users/users.service';
import { Injectable } from '@nestjs/common';
import { v4 as uuid4 } from 'uuid';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from './auth.repository';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    //private authRepository: AuthRepository,
    private usersService: UsersService,
  ) {}

  login(user: User) {
    const uuid = uuid4();
    const payload = { uuid, sub: user.id };
    const access_token = this.jwtService.sign(payload);
    const expiresIn = parseInt(process.env.JWT_REFRESH_EXPIRES_IN);
    const refresh_token = this.jwtService.sign(payload, { expiresIn });
    //this.authRepository.save(uuid, refresh_token, expiresIn);
    return {
      access_token,
      refresh_token,
    };
  }

  validateUser(payload: any) {
    const existedUser: User = this.usersService.users.find(
      (item) => item.email == payload.email,
    );
    if (existedUser) {
      return this.login(existedUser);
    } else {
      return this.usersService.create(payload);
    }
  }
}
