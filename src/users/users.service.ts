import { UsersRepository } from './users.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async create(kakaoId: number, thumbnail: string, name: string) {
    return await this.usersRepository.create(name, thumbnail, kakaoId);
  }
}
