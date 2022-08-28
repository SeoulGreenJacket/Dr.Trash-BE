import {
  ArgumentMetadata,
  Injectable,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import { TrashcansRepository } from '../trashcans.repository';

@Injectable()
export class TrashcanByIdPipe implements PipeTransform<number> {
  constructor(private readonly trashcansRepository: TrashcansRepository) {}

  async transform(value: number, metadata: ArgumentMetadata) {
    const trashcan = await this.trashcansRepository.findById(value);
    if (trashcan === null) {
      throw new NotFoundException('Trashcan not found');
    }
    return trashcan;
  }
}
