import { UsersService } from './../users/users.service';
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { KakaoAuthGuard } from './guard/kakao-auth.guard';
import { JwtToken } from './dto/jwt-token.dto';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(KakaoAuthGuard)
  @Get('login/kakao')
  async loginWithKakao(@Req() req): Promise<JwtToken> {
    return this.authService.validateUser(req.user);
  }

  @Get('logout')
  async logout() {
    //토큰 삭제 로직이 추가 될 예정입니다
    return;
  }
}
