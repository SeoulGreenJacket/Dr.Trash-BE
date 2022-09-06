import { JwtPayload } from './types/jwt-token-payload.type';
import { User } from 'src/users/entities/user.entity';
import { JwtTokenResponseDto } from './dto/jwt-token-response.dto';
import { Controller, Delete, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { KakaoAuthGuard } from './guard/kakao-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RefreshJwtAuthGuard } from './guard/refresh-jwt-auth.guard';
import { AccessUser } from './decorator/access-user.decorator';
import { RefreshUser } from './decorator/refresh-user.decorator';
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(KakaoAuthGuard)
  @Get('login/kakao')
  async loginWithKakao(@AccessUser() user: User): Promise<JwtTokenResponseDto> {
    return await this.authService.login(user.id);
  }

  @ApiBearerAuth()
  @UseGuards(RefreshJwtAuthGuard)
  @Delete('logout')
  async logout(@RefreshUser() payload: JwtPayload) {
    return await this.authService.logout(payload.uuid);
  }

  @ApiBearerAuth()
  @UseGuards(RefreshJwtAuthGuard)
  @Post('refresh')
  async refresh(@RefreshUser() payload: JwtPayload) {
    return await this.authService.refresh(payload.uuid, payload.userId);
  }
}
