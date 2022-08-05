import { KakaoStrategy } from './strategy/kakao.strategy';
import { CacheModule, forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    JwtModule.registerAsync({
      useFactory: async () => {
        return {
          secret: process.env.JWT_SECRET,
          signOptions: {
            expiresIn: process.env.JWT_ACCESS_EXPIRE_IN,
          },
        };
      },
    }),
    PassportModule,
    CacheModule.register(),
  ],
  controllers: [AuthController],
  providers: [AuthService, KakaoStrategy, JwtStrategy],
})
export class AuthModule {}
