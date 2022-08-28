import { Controller, Param, Post, UseGuards } from '@nestjs/common';
import { UserId } from 'src/auth/decorator/user-id.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Trashcan } from 'src/trashcans/entities/trashcan.entity';
import { TrashcanByIdPipe } from 'src/trashcans/pipe/trashcan-by-id.pipe';
import { TrashService } from './trash.service';

@Controller('trash')
@UseGuards(JwtAuthGuard)
export class TrashController {
  constructor(private readonly trashService: TrashService) {}

  @Post(':id/begin')
  async begin(
    @UserId() userId,
    @Param('id', TrashcanByIdPipe) trashcan: Trashcan,
  ): Promise<void> {
    this.trashService.beginTrashcanUsage(userId, trashcan.id);
  }

  @Post(':id/end')
  async end(
    @UserId() userId,
    @Param('id', TrashcanByIdPipe) trashcan: Trashcan,
  ): Promise<void> {
    this.trashService.endTrashcanUsage(userId, trashcan.id);
  }
}
