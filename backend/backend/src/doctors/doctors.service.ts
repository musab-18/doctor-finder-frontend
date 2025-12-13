import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { Doctor } from '../entities/doctor.entity';
import { CreateDoctorDto, UpdateDoctorDto, SearchDoctorDto } from './dto';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
  ) {}

  async create(createDoctorDto: CreateDoctorDto): Promise<Doctor> {
    const existingDoctor = await this.doctorRepository.findOne({
      where: { email: createDoctorDto.email },
    });

    if (existingDoctor) {
      throw new ConflictException('Doctor with this email already exists');
    }

    const doctor = this.doctorRepository.create(createDoctorDto);
    return this.doctorRepository.save(doctor);
  }

  async findAll(searchDto: SearchDoctorDto) {
    const {
      search,
      specializationId,
      city,
      minExperience,
      maxFee,
      page = 1,
      limit = 10,
      sortBy = 'rating',
      sortOrder = 'DESC',
    } = searchDto;

    const queryBuilder = this.doctorRepository
      .createQueryBuilder('doctor')
      .leftJoinAndSelect('doctor.specialization', 'specialization')
      .where('doctor.isActive = :isActive', { isActive: true });

    if (search) {
      queryBuilder.andWhere(
        '(doctor.firstName ILIKE :search OR doctor.lastName ILIKE :search OR specialization.name ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (specializationId) {
      queryBuilder.andWhere('doctor.specializationId = :specializationId', {
        specializationId,
      });
    }

    if (city) {
      queryBuilder.andWhere('doctor.city ILIKE :city', { city: `%${city}%` });
    }

    if (minExperience) {
      queryBuilder.andWhere('doctor.experience >= :minExperience', {
        minExperience,
      });
    }

    if (maxFee) {
      queryBuilder.andWhere('doctor.consultationFee <= :maxFee', { maxFee });
    }

    const validSortFields = [
      'rating',
      'experience',
      'consultationFee',
      'createdAt',
    ];
    const orderField = validSortFields.includes(sortBy) ? sortBy : 'rating';

    queryBuilder.orderBy(`doctor.${orderField}`, sortOrder);

    const total = await queryBuilder.getCount();
    const doctors = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return {
      data: doctors,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<Doctor> {
    const doctor = await this.doctorRepository.findOne({
      where: { id },
      relations: ['specialization'],
    });

    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${id} not found`);
    }

    return doctor;
  }

  async findFeatured(): Promise<Doctor[]> {
    return this.doctorRepository.find({
      where: { isFeatured: true, isActive: true },
      relations: ['specialization'],
      order: { rating: 'DESC' },
      take: 8,
    });
  }

  async findBySpecialization(specializationId: string): Promise<Doctor[]> {
    return this.doctorRepository.find({
      where: { specializationId, isActive: true },
      relations: ['specialization'],
      order: { rating: 'DESC' },
    });
  }

  async update(id: string, updateDoctorDto: UpdateDoctorDto): Promise<Doctor> {
    const doctor = await this.findOne(id);

    if (updateDoctorDto.email && updateDoctorDto.email !== doctor.email) {
      const existingDoctor = await this.doctorRepository.findOne({
        where: { email: updateDoctorDto.email },
      });

      if (existingDoctor) {
        throw new ConflictException('Doctor with this email already exists');
      }
    }

    Object.assign(doctor, updateDoctorDto);
    return this.doctorRepository.save(doctor);
  }

  async remove(id: string): Promise<void> {
    const doctor = await this.findOne(id);
    await this.doctorRepository.remove(doctor);
  }

  async toggleActive(id: string): Promise<Doctor> {
    const doctor = await this.findOne(id);
    doctor.isActive = !doctor.isActive;
    return this.doctorRepository.save(doctor);
  }

  async toggleFeatured(id: string): Promise<Doctor> {
    const doctor = await this.findOne(id);
    doctor.isFeatured = !doctor.isFeatured;
    return this.doctorRepository.save(doctor);
  }
}












