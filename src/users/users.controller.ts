import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DatabaseService } from 'src/database/database.service';
import {
  CreateOAuthDto,
  CreateUserDto,
  OAuthPayload,
} from './dto/create-user.dto';

@ApiTags('User')
@Controller('users')
export class UsersController {
  // db test용
  // constructor(private databaseService: DatabaseService) {}
  // @Post('createUser')
  // async create(@Body() user: CreateUserDto) {
  //   return await this.databaseService.userCreate(user);
  // }
  // @Post('createOAuth')
  // async oauthCreate(@Body() oauth: CreateOAuthDto) {
  //   return await this.databaseService.oauthCreate(oauth);
  // }
  // @Post('findOAuth')
  // async findOAuth(@Body() oauth: OAuthPayload) {
  //   return await this.databaseService.userFindByOAuth(
  //     oauth.oauth_id,
  //     oauth.provider,
  //   );
  // }
  // @Post('findUser')
  // async findUser(@Body() id: id) {
  //   return await this.databaseService.userFindByUser_id(id.user_id);
  // }
}
