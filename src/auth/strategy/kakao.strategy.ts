import { UsersRepository } from 'src/users/users.repository';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
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
    const provider = 'kakao';
    const oauthId = profileJson.id;
    const name = profileJson.kakao_account.profile.nickname;
    const thumbnail = profileJson.kakao_account.profile.thumbnail_image_url;

    const existedUser: User = await this.usersRepository.findByOAuth(
      oauthId,
      provider,
    );
    if (existedUser) {
      return existedUser.id;
    } else {
      const userId: number = await this.usersService.create(
        oauthId,
        provider,
        thumbnail,
        name,
      );
      return userId;
    }
  }
}
