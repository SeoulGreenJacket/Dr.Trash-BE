import {
  Controller,
  Get,
  NotFoundException,
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
  ) {
    return await this.trashService.endTrashcanUsage(usageId);
  }

  @Get('summary/:kind')
  @ApiOkResponse({
    description: 'Get trash summary',
    type: TrashSummary,
  })
  async summaryMonthly(
    @AccessUser() user,
    @Param('kind') kind: string,
    @Query('year', ParseIntPipe) year: number,
    @Query('month', ParseIntPipe) month: number,
  ) {
    if (kind === 'all') {
      return await this.trashService.getUserTrashSummaryAll(user.id);
    } else if (kind === 'detail') {
      return await this.trashService.getUserTrashSummaryInMonth(
        user.id,
        year,
        month,
      );
    } else {
      throw new NotFoundException();
    }
  }
}
