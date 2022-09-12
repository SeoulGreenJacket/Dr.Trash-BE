import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AccessUser } from 'src/auth/decorator/access-user.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Trashcan } from 'src/trashcans/entities/trashcan.entity';
import { TrashcanByIdPipe } from 'src/trashcans/pipe/trashcan-by-id.pipe';
import { TrashSummary } from './dto/trash-summary.dto';
import { UserEndTrashRes } from './dto/user-end-trash-response.dto';
import { OneTrialTrashSummary } from './dto/one-trial-trash-summary.dto';
import { TrashService } from './trash.service';
import { AchievementsService } from 'src/achievements/achievements.service';

@ApiTags('Trash')
@Controller('trash')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TrashController {
  constructor(
    private readonly trashService: TrashService,
    private readonly achievementsService: AchievementsService,
  ) {}

  @Post('begin/:id')
  @ApiOkResponse({
    description: 'Begin trashcan usage',
    type: Boolean,
  })
  async begin(
    @AccessUser() user,
    @Param('id', TrashcanByIdPipe) trashcan: Trashcan,
  ): Promise<number> {
    return await this.trashService.beginTrashcanUsage(user.id, trashcan.id);
  }

  @Post('end')
  @ApiOkResponse({
    description: 'End trashcan usage',
    type: Boolean,
  })
  async end(
    @AccessUser() user,
    @Query('usageId', ParseIntPipe) usageId: number,
    @Body('type') type: string,
  ): Promise<UserEndTrashRes> {
    const trashSummary = await this.trashService.endTrashcanUsage(usageId, type);
    await this.achievementsService.checkTrashAchievements(user.id);
    return trashSummary;
  }

  @Get('summary/all')
  @ApiOkResponse({
    description: 'Get trash summary',
    type: TrashSummary,
  })
  async allSummary(@AccessUser() user): Promise<TrashSummary> {
    return await this.trashService.getUserTrashSummaryAll(user.id);
  }

  @Get('summary/detail')
  async detailSummary(
    @AccessUser() user,
    @Query('year', ParseIntPipe, new DefaultValuePipe(new Date().getFullYear()))
    year: number,
    @Query(
      'month',
      ParseIntPipe,
      new DefaultValuePipe(new Date().getMonth() + 1),
    )
    month: number,
  ): Promise<OneTrialTrashSummary[]> {
    return await this.trashService.getUserTrashSummaryDetail(
      user.id,
      year,
      month,
    );
  }
}
