import {
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AccessUser } from 'src/auth/decorator/access-user.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Trashcan } from 'src/trashcans/entities/trashcan.entity';
import { TrashLog } from './dto/trash-log.dto';
import { UserEndTrashRes } from './dto/user-end-trash-response.dto';
import { TrashService } from './trash.service';
import { AchievementsService } from 'src/achievements/achievements.service';
import { TrashcanByCodePipe } from 'src/trashcans/pipe/trashcan-by-code.pipe';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@ApiTags('Trash')
@Controller('trash')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TrashController {
  constructor(
    private readonly trashService: TrashService,
    private readonly achievementsService: AchievementsService,
    private readonly usersService: UsersService,
  ) {}

  @Post('begin/:code')
  @ApiOkResponse({
    description: 'Begin trashcan usage',
    type: Boolean,
  })
  async begin(
    @AccessUser() user,
    @Param('code', TrashcanByCodePipe) trashcan: Trashcan,
  ): Promise<number> {
    return await this.trashService.beginTrashcanUsage(user.id, trashcan.id);
  }

  @Post('end')
  @ApiOkResponse({
    description: 'End trashcan usage',
    type: Boolean,
  })
  async end(@AccessUser() user): Promise<UserEndTrashRes> {
    const beforePoint = user.point;
    const { date, type } = await this.trashService.endTrashcanUsage(user.id);
    const log = await this.trashService.getTrashLog(user.id, date);
    await this.usersService.update(user.id, {
      point: beforePoint + log[type].success * 10,
    });

    await this.achievementsService.checkTrashAchievements(user.id);
    return {
      beforePoint,
      date,
      type,
      success: log[type].success,
      failure: log[type].failure,
    };
  }

  @Get('log')
  @ApiOkResponse({
    description: 'Get user trash log',
    type: TrashLog,
  })
  async getTrashLog(
    @AccessUser() user: User,
    @Query('from', new DefaultValuePipe(new Date(0).toISOString()))
    from: string,
    @Query('to', new DefaultValuePipe(new Date().toISOString())) to: string,
  ) {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    return await this.trashService.getTrashLog(user.id, fromDate, toDate);
  }
}
