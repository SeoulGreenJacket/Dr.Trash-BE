import { AuthService } from './../auth.service';
import { BadRequestException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';
import { UserKakaoDto } from '../dto/user.dto';

export class KakaoStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
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
    const profileAccount = profile._json.kakao_account;

    const userPayload: UserKakaoDto = {
      name: profileAccount.profile.nickname,
      thumnail: profileAccount.profile.thumbnail_image_url,
      email:
        profileAccount.email &&
        profileAccount.is_email_valid &&
        profileAccount.is_email_verified
          ? profileAccount.email
          : null,
    };

    if (!userPayload.email) {
      throw new BadRequestException('email is not found');
    }

    return userPayload;
  }
}
