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
import { AccessUser } from 'src/auth/decorator/access-user.decorator';
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
    @AccessUser() user,
    @Param('id', TrashcanByIdPipe) trashcan: Trashcan,
  ): Promise<boolean> {
    return await this.trashService.beginTrashcanUsage(user.id, trashcan.id);
  }

  @Post('end/:id')
  @ApiOkResponse({
    description: 'End trashcan usage',
    type: Boolean,
  })
  async end(
    @AccessUser() user,
    @Param('id', TrashcanByIdPipe) trashcan: Trashcan,
  ): Promise<boolean> {
    return await this.trashService.endTrashcanUsage(user.id, trashcan.id);
  }

  @Get('summary')
  @ApiOkResponse({
    description: 'Get trash summary',
    type: TrashSummary,
  })
  async summary(
    @AccessUser() user,
    @Query('year', ParseIntPipe) year,
    @Query('month', ParseIntPipe) month,
  ): Promise<TrashSummary> {
    return await this.trashService.getUserTrashSummary(user.id, year, month);
  }
}
