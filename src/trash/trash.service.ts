import { ConflictException, Injectable } from '@nestjs/common';
import { TrashLog } from './dto/trash-log.dto';
import { TrashRepository } from './trash.repository';
import { TrashcansRepository } from 'src/trashcans/trashcans.repository';
import { KafkaService } from 'src/kafka/kafka.service';
import { setTimeout } from 'timers/promises';
import { UsersRepository } from 'src/users/users.repository';

@Injectable()
export class TrashService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly trashRepository: TrashRepository,
    private readonly trashcansRepository: TrashcansRepository,
    private readonly kafkaService: KafkaService,
  ) {}

  async beginTrashcanUsage(
    userId: number,
    trashcanId: number,
  ): Promise<number> {
    const usageId = await this.trashRepository.createTrashcanUsage(
      userId,
      trashcanId,
    );
    this.kafkaService.send(trashcanId.toString(), 'start');
    return usageId;
  }

  async endTrashcanUsage(userId: number) {
    const usage = await this.trashRepository.getLastUsage(userId);
    if (!usage) {
      throw new ConflictException('Open trashcan first');
    }
    const trashcan = await this.trashcansRepository.findById(usage.trashcanId);
    this.kafkaService.send(trashcan.code, 'pause');

    // wait for last image to be processed
    // TODO: change to something better
    await setTimeout(5000, 'All done');

    await this.trashRepository.closeTrashcan(usage.id);
    return { date: usage.beginAt, type: trashcan.type };
  }

  async getTrashLog(
    userId: number,
    from: Date = new Date(0),
    to: Date = new Date(),
  ) {
    const trashCount = await this.trashRepository.countTrash(userId, from, to);
    const trashLog: TrashLog = {
      can: {
        success: 0,
        failure: 0,
      },
      pet: {
        success: 0,
        failure: 0,
      },
      plastic: {
        success: 0,
        failure: 0,
      },
    };

    trashCount.forEach((count) => {
      if (count.trashType === count.trashcanType) {
        trashLog[count.trashcanType].success += count.count;
      } else {
        trashLog[count.trashcanType].failure += count.count;
      }
    });

    return trashLog;
  }
}
