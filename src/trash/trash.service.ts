import { ConflictException, Injectable } from '@nestjs/common';
import { TrashRepository } from './trash.repository';
import { TrashcansRepository } from 'src/trashcans/trashcans.repository';
import { KafkaService } from 'src/kafka/kafka.service';
import { setTimeout } from 'timers/promises';
import { OneTrialTrashSummary } from './dto/one-trial-trash-summary.dto';

@Injectable()
export class TrashService {
  constructor(
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
    return { date: usage.beginAt };
  }

  async getTrashTrails(
    userId: number,
    from: Date = new Date(0),
    to: Date = new Date(),
  ): Promise<OneTrialTrashSummary[]> {
    const usages = await this.trashRepository.findUsages(userId, from, to);
    const trails: OneTrialTrashSummary[] = [];

    await Promise.all(
      usages.map(async (usage) => {
        if (usage.endAt === null) {
          return;
        }

        const log = await this.trashRepository.countTrash(
          userId,
          usage.beginAt,
          usage.endAt,
        );
        const trashcan = await this.trashcansRepository.findById(
          usage.trashcanId,
        );

        const trail = new OneTrialTrashSummary();
        trail.beforePoint = usage.beforePoint;
        trail.date = usage.beginAt;
        trail.type = trashcan.type;
        trail.success = 0;
        trail.failure = 0;
        log.forEach((count) => {
          if (count.trashType === count.trashcanType) {
            trail.success += count.count;
          } else {
            trail.failure += count.count;
          }
        });
        trails.push(trail);
      }),
    );

    return trails;
  }
}
