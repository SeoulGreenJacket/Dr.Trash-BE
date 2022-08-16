import { UsersRepository } from './users.repository';
import { Injectable } from '@nestjs/common';
import {
  CreateUserDto,
  CreateOAuthDto,
  UserPayload,
  OAuthPayload,
} from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async create(userPayload: UserPayload, oAuthPayload: OAuthPayload) {
    const point = 0;
    const user: CreateUserDto = { ...userPayload, point };
    const user_id = await this.usersRepository.create(user);
    const oauth: CreateOAuthDto = { ...oAuthPayload, user_id };
    await this.usersRepository.createOAuth(oauth);

    return await this.usersRepository.findByUserId(user_id);
  }
}
