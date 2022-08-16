import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { KakaoAuthGuard } from './guard/kakao-auth.guard';
import { JwtToken } from './dto/jwt-token.dto';
import { ApiTags } from '@nestjs/swagger';
import { RefreshJwtStrategy } from './strategy/refresh-jwt.strategy';
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(KakaoAuthGuard)
  @Get('login/kakao')
  async loginWithKakao(@Req() req): Promise<JwtToken> {
    return await this.authService.login(req.user);
  }

  @UseGuards(RefreshJwtStrategy)
  @Get('logout')
  async logout(@Req() req) {
    return await this.authService.logout(req.user);
  }
}
