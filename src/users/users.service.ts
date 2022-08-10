import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import {
  CreateUserDto,
  CreateOauthDto,
  UserPayload,
  OauthPayload,
} from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private databaseService: DatabaseService) {}

  async create(userPayload: UserPayload, oauthPayload: OauthPayload) {
    const point = 0;
    const user: CreateUserDto = { ...userPayload, point };
    const user_id = await this.databaseService.userCreate(user);
    const oauth: CreateOauthDto = { ...oauthPayload, user_id };
    await this.databaseService.oauthCreate(oauth);

    return this.databaseService.userFindByUser_id(user_id);
  }
}
