import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserId } from 'src/auth/decorator/user-id.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Trashcan } from 'src/trashcans/entities/trashcan.entity';
import { TrashcanByIdPipe } from 'src/trashcans/pipe/trashcan-by-id.pipe';
import { TrashSummary } from './dto/trash-summary.dto';
import { TrashService } from './trash.service';

@ApiTags('Trash')
@Controller('trash')
@UseGuards(JwtAuthGuard)
export class TrashController {
  constructor(private readonly trashService: TrashService) {}

  @Post('begin/:id')
  @ApiOkResponse({
    description: 'Begin trashcan usage',
    type: Boolean,
  })
  async begin(
    @UserId() userId,
    @Param('id', TrashcanByIdPipe) trashcan: Trashcan,
  ): Promise<boolean> {
    return await this.trashService.beginTrashcanUsage(userId, trashcan.id);
  }

  @Post('end/:id')
  @ApiOkResponse({
    description: 'End trashcan usage',
    type: Boolean,
  })
  async end(
    @UserId() userId,
    @Param('id', TrashcanByIdPipe) trashcan: Trashcan,
  ): Promise<boolean> {
    return await this.trashService.endTrashcanUsage(userId, trashcan.id);
  }

  @Get('summary')
  @ApiOkResponse({
    description: 'Get trash summary',
    type: TrashSummary,
  })
  async summary(
    @UserId() userId,
    @Query('year', ParseIntPipe) year,
    @Query('month', ParseIntPipe) month,
  ): Promise<TrashSummary> {
    return await this.trashService.getUserTrashSummary(userId, year, month);
  }
}
