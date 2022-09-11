import {
  Controller,
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
import { TrashService } from './trash.service';

@ApiTags('Trash')
@Controller('trash')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TrashController {
  constructor(private readonly trashService: TrashService) {}

  @Post('begin/:id')
  @ApiOkResponse({
    description: 'Begin trashcan usage',
    type: Boolean,
  })
  async begin(
    @AccessUser() user,
    //@Param('id', TrashcanByIdPipe) trashcan: Trashcan,
  ): Promise<number> {
    return await this.trashService.beginTrashcanUsage(user.id, 1);
  }

  @Post('end/:id')
  @ApiOkResponse({
    description: 'End trashcan usage',
    type: Boolean,
  })
  async end(
    @AccessUser() user,
    @Query('usageId', ParseIntPipe) usageId: number,
  ) {
    return await this.trashService.endTrashcanUsage(usageId);
  }

  @Get('summary')
  @ApiOkResponse({
    description: 'Get trash summary',
    type: TrashSummary,
  })
  async summary(@AccessUser() user): Promise<TrashSummary> {
    return await this.trashService.getUserTrashSummaryAll(user.id);
  }

  @Get('summary-monthly')
  @ApiOkResponse({
    description: 'Get trash summary',
    type: TrashSummary,
  })
  async summaryMonthly(
    @AccessUser() user,
    @Query('year', ParseIntPipe) year: number,
    @Query('month', ParseIntPipe) month: number,
  ): Promise<TrashSummary> {
    return await this.trashService.getUserTrashSummaryInMonth(1, year, month);
  }
}
