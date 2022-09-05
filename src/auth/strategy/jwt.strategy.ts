import { JwtPayload } from './../dto/jwt-token.dto';
import { User } from 'src/users/entities/user.entity';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersRepository } from 'src/users/users.repository';
import { jwt } from 'src/common/environments';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersRepository: UsersRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwt().accessConfig.secret,
    });
  }

  async validate(payload: JwtPayload) {
    const user: User = await this.usersRepository.findByUserId(payload.userId);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
