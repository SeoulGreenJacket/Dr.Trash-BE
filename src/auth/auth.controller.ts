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
  async kakaopage(@Req() req) {
    return;
  }

  @UseGuards(KakaoAuthGuard)
  @Get('login/kakao/callback')
  async login(@Req() req): Promise<JwtToken> {
    return this.authService.validateUser(req.user);
  }
}
