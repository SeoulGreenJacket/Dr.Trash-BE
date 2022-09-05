import { User } from 'src/users/entities/user.entity';
import { UsersRepository } from 'src/users/users.repository';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../dto/jwt-token.dto';
import { AuthRepository } from '../auth.repository';
import { jwt } from 'src/common/environments';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'refresh-jwt',
) {
  constructor(
    private usersRepository: UsersRepository,
    private authRepository: AuthRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwt().refreshConfig.secret,
    });
  }

  async validate(payload: JwtPayload) {
    const user: User = await this.usersRepository.findByUserId(payload.userId);
    const tokenId = await this.authRepository.findToken(payload.uuid);
    if (!user || !tokenId) {
      throw new UnauthorizedException('user or token not found');
    }

    return payload;
  }
}
