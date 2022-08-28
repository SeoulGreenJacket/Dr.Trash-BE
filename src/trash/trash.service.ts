import { Injectable } from '@nestjs/common';
import { TrashRepository } from './trash.repository';

@Injectable()
export class TrashService {
  constructor(private readonly trashRepository: TrashRepository) {}

  async beginTrashcanUsage(userId: number, trashcanId: number): Promise<void> {
    await this.trashRepository.logTrashcanUsage(userId, trashcanId, true);
  }

  async endTrashcanUsage(userId: number, trashcanId: number): Promise<void> {
    await this.trashRepository.logTrashcanUsage(userId, trashcanId, false);
  }
}
