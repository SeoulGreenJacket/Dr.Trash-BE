import { UsersRepository } from './users.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async create(
    oauthId: string,
    provider: string,
    imageUri: string,
    name: string,
  ) {
    const userId = await this.usersRepository.create(name, imageUri);
    await this.usersRepository.createOAuth(oauthId, provider, userId);

    return userId;
  }
}
