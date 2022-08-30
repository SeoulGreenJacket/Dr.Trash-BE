import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';
import { kakao } from 'src/common/environments';
import { User } from 'src/users/entities/user.entity';
import { UsersRepository } from 'src/users/users.repository';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy) {
  constructor(
    private usersRepository: UsersRepository,
    private usersService: UsersService,
    private readonly httpService: HttpService,
  ) {
    super(kakao.config);
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

    await this.httpService.axiosRef.post(
      'http://kapi.kakao.com/v1/user/logout',
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return userId;
  }
}
