import { JwtTokenResponseDto } from './dto/jwt-token-response.dto';
import { Controller, Delete, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { KakaoAuthGuard } from './guard/kakao-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RefreshJwtAuthGuard } from './guard/refresh-jwt-auth.guard';
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(KakaoAuthGuard)
  @Get('login/kakao')
  async loginWithKakao(@Req() req): Promise<JwtTokenResponseDto> {
    return await this.authService.login(req.user);
  }

  @ApiBearerAuth()
  @UseGuards(RefreshJwtAuthGuard)
  @Delete('logout')
  async logout(@Req() req) {
    return await this.authService.logout(req.user.uuid);
  }

  @ApiBearerAuth()
  @UseGuards(RefreshJwtAuthGuard)
  @Post('refresh')
  async refresh(@Req() req) {
    return await this.authService.refresh(req.user.uuid, req.user.userId);
  }
}
