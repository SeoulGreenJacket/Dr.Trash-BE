import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { DatabaseService } from './../../database/database.service';
import { JwtPayload } from '../dto/jwt-payload.dto';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'refresh-jwt',
) {
  constructor(private databaseService: DatabaseService) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refresh_token'),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  // async validate(payload: JwtPayload) {
  //   let user: any = await this.databaseService.userFindByUser_id(payload.sub);
  //   if (!user) {
  //     throw new UnauthorizedException();
  //   }
  //   user = {
  //     ...user,
  //     uuid: payload.uuid,
  //   };
  //   return user;
  // }
}
