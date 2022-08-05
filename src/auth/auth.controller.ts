import { User } from './../users/entities/user.entity';
import { UsersService } from './../users/users.service';
import { UserKakaoDto } from './dto/user.dto';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { KakaoAuthGuard } from './guard/kakao-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(KakaoAuthGuard)
  @Get('login/kakao')
  async kakaopage(@Req() req) {
    return;
  }

  @UseGuards(KakaoAuthGuard)
  @Post('login/kakao/callback')
  async login(@Req() req, @Res() res) {
    const token: any = this.authService.validateUser(req.user);
    res.cookie('access_token', token.access_token);
    res.cookie('refresh_token', token.refresh_token);
    res.end();
    return;
  }
}
