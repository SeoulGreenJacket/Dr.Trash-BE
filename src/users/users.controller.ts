import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DatabaseService } from 'src/database/database.service';
import { UsersRepository } from './users.repository';

@ApiTags('User')
@Controller('users')
export class UsersController {
  // db 테스트용
  // constructor(private userRepository: UsersRepository) {}
  // @Post('createUser')
  // async create(@Body() user: CreateUserDto) {
  //   return await this.userRepository.create(user);
  // }
  // @Post('createOAuth')
  // async oauthCreate(@Body() oauth: CreateOAuthDto) {
  //   return await this.userRepository.createOAuth(oauth);
  // }
  // @Post('findOAuth')
  // async findOAuth(@Body() oauth: OAuthPayload) {
  //   return await this.userRepository.checkByOAuth(
  //     oauth.oauth_id,
  //     oauth.provider,
  //   );
  // }
  // @Post('findUser')
  // async findUser(@Body() id: id) {
  //   return await this.userRepository.findByUserId(id.user_id);
  // }
}
