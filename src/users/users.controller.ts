import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DatabaseService } from 'src/database/database.service';
import { CreateUserDto } from './dto/create-user.dto';

@ApiTags('User')
@Controller('users')
export class UsersController {
  constructor(private readonly databaseService: DatabaseService) {}

  // 디비에 유저 생성 swagger 테스트용 코드
  // @Post()
  // async create(@Body() userCreateDto: CreateUserDto) {
  //   return await this.databaseService.userCreate(userCreateDto);
  // }
}
