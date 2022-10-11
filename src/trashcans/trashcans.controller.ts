import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { TrashcansService } from './trashcans.service';
import { CreateTrashcanDto } from './dto/create-trashcan.dto';
import { UpdateTrashcanDto } from './dto/update-trashcan.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { AccessUser } from 'src/auth/decorator/access-user.decorator';
import { ApiTags } from '@nestjs/swagger';
import { TrashcanByIdPipe } from './pipe/trashcan-by-id.pipe';
import { Trashcan } from './entities/trashcan.entity';
import { AchievementsService } from 'src/achievements/achievements.service';

@ApiTags('Trashcan')
@Controller('trashcans')
@UseGuards(JwtAuthGuard)
export class TrashcansController {
  constructor(
    private readonly trashcansService: TrashcansService,
    private readonly achievementsService: AchievementsService,
  ) {}

  @Get()
  async findAll(
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
    @Query('manager', new DefaultValuePipe(0), ParseIntPipe) managerId: number,
  ) {
    return await this.trashcansService.findAll(limit, offset, managerId);
  }

  @Post()
  async create(@AccessUser() user, @Body() dto: CreateTrashcanDto) {
    await this.trashcansService.create(user.id, dto);
    await this.achievementsService.checkTrashcanAchievements(user.id);
    return { message: 'success' };
  }

  @Get(':id')
  findOne(@Param('id', TrashcanByIdPipe) trashcan: Trashcan) {
    return trashcan;
  }

  @Patch(':id')
  async update(
    @Param('id', TrashcanByIdPipe) trashcan: Trashcan,
    @Body() updateTrashcanDto: UpdateTrashcanDto,
  ) {
    await this.trashcansService.update(trashcan.id, updateTrashcanDto);
    return { message: 'success' };
  }

  @Delete(':id')
  remove(@Param('id', TrashcanByIdPipe) trashcan: Trashcan) {
    return this.trashcansService.remove(trashcan.id);
  }
}
