import { Injectable } from '@nestjs/common';
import { DatabaseService } from './../database/database.service';
import {
  CreateUserDto,
  CreateOAuthDto,
  UserPayload,
  OAuthPayload,
} from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private databaseService: DatabaseService) {}

  async create(userPayload: UserPayload, oAuthPayload: OAuthPayload) {
    const point = 0;
    const user: CreateUserDto = { ...userPayload, point };
    const user_id = await this.databaseService.userCreate(user);
    const oauth: CreateOAuthDto = { ...oAuthPayload, user_id };
    await this.databaseService.oauthCreate(oauth);

    return await this.databaseService.userFindByUser_id(user_id);
  }
}
