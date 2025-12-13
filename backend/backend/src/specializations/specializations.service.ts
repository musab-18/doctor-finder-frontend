import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Specialization } from '../entities/specialization.entity';
import { CreateSpecializationDto, UpdateSpecializationDto } from './dto';

@Injectable()
export class SpecializationsService {
  constructor(
    @InjectRepository(Specialization)
    private specializationRepository: Repository<Specialization>,
  ) {}

  async create(
    createSpecializationDto: CreateSpecializationDto,
  ): Promise<Specialization> {
    const existing = await this.specializationRepository.findOne({
      where: { name: createSpecializationDto.name },
    });

    if (existing) {
      throw new ConflictException('Specialization with this name already exists');
    }

    const specialization = this.specializationRepository.create(
      createSpecializationDto,
    );
    return this.specializationRepository.save(specialization);
  }

  async findAll(): Promise<Specialization[]> {
    return this.specializationRepository.find({
      where: { isActive: true },
      order: { name: 'ASC' },
    });
  }

  async findAllAdmin(): Promise<Specialization[]> {
    return this.specializationRepository.find({
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Specialization> {
    const specialization = await this.specializationRepository.findOne({
      where: { id },
      relations: ['doctors'],
    });

    if (!specialization) {
      throw new NotFoundException(`Specialization with ID ${id} not found`);
    }

    return specialization;
  }

  async update(
    id: string,
    updateSpecializationDto: UpdateSpecializationDto,
  ): Promise<Specialization> {
    const specialization = await this.findOne(id);

    if (
      updateSpecializationDto.name &&
      updateSpecializationDto.name !== specialization.name
    ) {
      const existing = await this.specializationRepository.findOne({
        where: { name: updateSpecializationDto.name },
      });

      if (existing) {
        throw new ConflictException(
          'Specialization with this name already exists',
        );
      }
    }

    Object.assign(specialization, updateSpecializationDto);
    return this.specializationRepository.save(specialization);
  }

  async remove(id: string): Promise<void> {
    const specialization = await this.findOne(id);
    await this.specializationRepository.remove(specialization);
  }

  async toggleActive(id: string): Promise<Specialization> {
    const specialization = await this.findOne(id);
    specialization.isActive = !specialization.isActive;
    return this.specializationRepository.save(specialization);
  }
}












