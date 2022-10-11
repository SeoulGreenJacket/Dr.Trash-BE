import {
  ArgumentMetadata,
  Injectable,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import { TrashcansRepository } from '../trashcans.repository';

@Injectable()
export class TrashcanByCodePipe implements PipeTransform<string> {
  constructor(private readonly trashcansRepository: TrashcansRepository) {}

  async transform(value: string, metadata: ArgumentMetadata) {
    const trashcan = await this.trashcansRepository.findByCode(value);
    if (trashcan === null) {
      throw new NotFoundException('Trashcan not found');
    }
    return trashcan;
  }
}
