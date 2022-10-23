import { HttpModule } from '@nestjs/axios';
import { DatabaseModule } from './../database/database.module';
import { KakaoStrategy } from './strategy/kakao.strategy';
import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from './../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { RefreshJwtStrategy } from './strategy/refresh-jwt.strategy';
import { AuthRepository } from './auth.repository';
import { jwt } from 'src/common/environments';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    JwtModule.registerAsync({
      useFactory: async () => jwt.accessConfig,
    }),
    PassportModule,
    DatabaseModule,
    HttpModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    KakaoStrategy,
    JwtStrategy,
    AuthRepository,
    RefreshJwtStrategy,
  ],
  exports: [
    AuthService,
    KakaoStrategy,
    JwtStrategy,
    AuthRepository,
    RefreshJwtStrategy,
  ],
})
export class AuthModule {}
