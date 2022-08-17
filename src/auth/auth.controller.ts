import { JwtTokenResponse } from './dto/jwt-token.dto';
import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { KakaoAuthGuard } from './guard/kakao-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { RefreshJwtAuthGuard } from './guard/refresh-jwt-auth.guard';
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(KakaoAuthGuard)
  @Get('login/kakao')
  async loginWithKakao(@Req() req): Promise<JwtTokenResponse> {
    return await this.authService.login(req.user);
  }

  @UseGuards(RefreshJwtAuthGuard)
  @Post('logout')
  async logout(@Req() req) {
    return await this.authService.logout(req.user.uuid);
  }

  @UseGuards(RefreshJwtAuthGuard)
  @Post('refresh')
  async refresh(@Req() req) {
    return await this.authService.refresh(req.user.uuid, req.user.sub);
  }
}
