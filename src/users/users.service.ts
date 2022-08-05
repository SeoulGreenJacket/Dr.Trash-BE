import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { v4 as uuid4 } from 'uuid';

@Injectable()
export class UsersService {
  users = [];

  create(userPayload: CreateUserDto) {
    const uuid = uuid4();
    const user: User = { ...userPayload, id: uuid };
    this.users.push(user);
    return user;
  }
}
