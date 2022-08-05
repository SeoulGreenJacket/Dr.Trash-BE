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
import { Response } from 'express';
import { JwtToken } from './dto/jwt-token.dto';

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
  async login(@Req() req, @Res() res: Response) {
    const token: JwtToken = this.authService.validateUser(req.user);
    res.cookie('access_token', token.access_token, { httpOnly: true });
    res.cookie('refresh_token', token.refresh_token, { httpOnly: true });
    res.end();
    return;
  }
}
