import { AuthRepository } from './auth.repository';
import { UsersService } from './../users/users.service';
import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { KakaoAuthGuard } from './guard/kakao-auth.guard';
import { JwtToken } from './dto/jwt-token.dto';
import { ApiTags } from '@nestjs/swagger';
import { RefreshJwtStrategy } from './strategy/jwt.strategy';
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly authRepository: AuthRepository,
  ) {}

  @UseGuards(KakaoAuthGuard)
  @Get('login/kakao')
  async loginWithKakao(@Req() req): Promise<JwtToken> {
    return this.authService.validateUser(req.user);
  }

  @UseGuards(RefreshJwtStrategy)
  @Get('logout')
  async logout(@Req() req, @Query() state) {
    return this.authService.logout(req.user);
  }
}
