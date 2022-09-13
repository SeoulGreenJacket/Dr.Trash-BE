import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TrashcansRepository } from './trashcans.repository';
import { CreateTrashcanDto } from './dto/create-trashcan.dto';
import { UpdateTrashcanDto } from './dto/update-trashcan.dto';
import { Trashcan } from './entities/trashcan.entity';

@Injectable()
export class TrashcansService {
  constructor(private readonly trashcansRepository: TrashcansRepository) {}

  async create(userId: number, dto: CreateTrashcanDto): Promise<boolean> {
    if ((await this.trashcansRepository.checkCode(dto.code)) === false) {
      throw new NotFoundException('Invalid code');
    }
    if ((await this.trashcansRepository.findByCode(dto.code)) !== null) {
      throw new ConflictException('Code already in use');
    }
    this.trashcansRepository.create(userId, dto);
    return true;
  }

  async findAll(limit: number, offset: number): Promise<Trashcan[]> {
    return await this.trashcansRepository.findAll(limit, offset);
  }

  async findByManagerId(managerId: number): Promise<Trashcan[]> {
    return await this.trashcansRepository.findByManagerId(managerId);
  }

  async findById(id: number): Promise<Trashcan> {
    return await this.trashcansRepository.findById(id);
  }

  async findByCode(code: string): Promise<Trashcan> {
    return await this.trashcansRepository.findByCode(code);
  }

  async update(id: number, dto: UpdateTrashcanDto) {
    return await this.trashcansRepository.update(id, dto);
  }

  async remove(id: number) {
    return await this.trashcansRepository.remove(id);
  }
}
