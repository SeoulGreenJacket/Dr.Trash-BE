import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UserId } from 'src/auth/decorator/user-id.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Trashcan } from 'src/trashcans/entities/trashcan.entity';
import { TrashcanByIdPipe } from 'src/trashcans/pipe/trashcan-by-id.pipe';
import { TrashSummary } from './dto/trash-summary.dto';
import { TrashService } from './trash.service';

@Controller('trash')
@UseGuards(JwtAuthGuard)
export class TrashController {
  constructor(private readonly trashService: TrashService) {}

  @Post('begin/:id')
  async begin(
    @UserId() userId,
    @Param('id', TrashcanByIdPipe) trashcan: Trashcan,
  ): Promise<boolean> {
    return await this.trashService.beginTrashcanUsage(userId, trashcan.id);
  }

  @Post('end/:id')
  async end(
    @UserId() userId,
    @Param('id', TrashcanByIdPipe) trashcan: Trashcan,
  ): Promise<boolean> {
    return await this.trashService.endTrashcanUsage(userId, trashcan.id);
  }

  @Get('summary')
  async summary(@UserId() userId): Promise<TrashSummary> {
    return await this.trashService.getUserTrashSummary(userId);
  }
}
