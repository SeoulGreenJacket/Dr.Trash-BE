import { UserRankResponseDto } from 'src/users/dto/user-rank-response.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { CheckUserIdGuard } from './guard/check-user-id.guard';
import { UserUpdateDto } from './dto/user-update.dto';
import { UsersService } from 'src/users/users.service';
import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@ApiTags('User')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  async findMe(@Req() req): Promise<any> {
    return req.user.id;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('rank')
  async findRankAll(
    @Query('limit', ParseIntPipe, new DefaultValuePipe(10)) limit: number,
    @Query('offset', ParseIntPipe, new DefaultValuePipe(0)) offset: number,
  ): Promise<UserRankResponseDto[]> {
    return await this.usersService.findRankAll(limit, offset);
  }

  @ApiBearerAuth()
  @UseGuards(CheckUserIdGuard)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserResponseDto> {
    return await this.usersService.findOne(id);
  }

  @UsePipes(
    new ValidationPipe({
      enableDebugMessages: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )
  @ApiBearerAuth()
  @UseGuards(CheckUserIdGuard)
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() userUpdateDto: UserUpdateDto,
    @Req() req,
  ): Promise<any> {
    return await this.usersService.update(userUpdateDto, req.user);
  }

  @ApiBearerAuth()
  @UseGuards(CheckUserIdGuard)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<number> {
    return await this.usersService.delete(id);
  }
}
