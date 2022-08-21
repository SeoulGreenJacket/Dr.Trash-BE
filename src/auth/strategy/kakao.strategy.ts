import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';
import { User } from 'src/users/entities/user.entity';
import { UsersRepository } from 'src/users/users.repository';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy) {
  constructor(
    private usersRepository: UsersRepository,
    private usersService: UsersService,
  ) {
    super({
      clientID: process.env.CLIENT_ID,
      callbackURL: process.env.CALLBACK_URL,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any,
  ) {
    const profileJson = profile._json;
    const kakaoId: bigint = profileJson.id;
    const name = profileJson.kakao_account.profile.nickname;
    const thumbnail = profileJson.kakao_account.profile.thumbnail_image_url;

    let userId: number;
    const existedUser: User = await this.usersRepository.findByKakaoId(kakaoId);
    if (existedUser) {
      userId = existedUser.id;
    } else {
      userId = await this.usersService.create(kakaoId, thumbnail, name);
    }

    fetch('/v1/user/logout', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return userId;
  }
}
