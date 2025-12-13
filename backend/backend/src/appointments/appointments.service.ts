import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment, AppointmentStatus } from '../entities/appointment.entity';
import { User, UserRole } from '../entities/user.entity';
import { CreateAppointmentDto, UpdateAppointmentDto } from './dto';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
  ) {}

  async create(
    createAppointmentDto: CreateAppointmentDto,
    user: User,
  ): Promise<Appointment> {
    // Check for existing appointment at the same time
    const existingAppointment = await this.appointmentRepository.findOne({
      where: {
        doctorId: createAppointmentDto.doctorId,
        appointmentDate: new Date(createAppointmentDto.appointmentDate),
        appointmentTime: createAppointmentDto.appointmentTime,
        status: AppointmentStatus.CONFIRMED,
      },
    });

    if (existingAppointment) {
      throw new BadRequestException(
        'This time slot is already booked. Please choose another time.',
      );
    }

    const appointment = this.appointmentRepository.create({
      ...createAppointmentDto,
      userId: user.id,
      appointmentDate: new Date(createAppointmentDto.appointmentDate),
    });

    return this.appointmentRepository.save(appointment);
  }

  async findAll(user: User) {
    if (user.role === UserRole.ADMIN) {
      return this.appointmentRepository.find({
        relations: ['user', 'doctor', 'doctor.specialization'],
        order: { appointmentDate: 'DESC', appointmentTime: 'DESC' },
      });
    }

    return this.appointmentRepository.find({
      where: { userId: user.id },
      relations: ['doctor', 'doctor.specialization'],
      order: { appointmentDate: 'DESC', appointmentTime: 'DESC' },
    });
  }

  async findOne(id: string, user: User): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      relations: ['user', 'doctor', 'doctor.specialization'],
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    if (user.role !== UserRole.ADMIN && appointment.userId !== user.id) {
      throw new ForbiddenException(
        'You do not have permission to view this appointment',
      );
    }

    return appointment;
  }

  async findUpcoming(user: User) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const queryBuilder = this.appointmentRepository
      .createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.doctor', 'doctor')
      .leftJoinAndSelect('doctor.specialization', 'specialization')
      .where('appointment.appointmentDate >= :today', { today })
      .andWhere('appointment.status != :cancelled', {
        cancelled: AppointmentStatus.CANCELLED,
      });

    if (user.role !== UserRole.ADMIN) {
      queryBuilder.andWhere('appointment.userId = :userId', {
        userId: user.id,
      });
    } else {
      queryBuilder.leftJoinAndSelect('appointment.user', 'user');
    }

    return queryBuilder
      .orderBy('appointment.appointmentDate', 'ASC')
      .addOrderBy('appointment.appointmentTime', 'ASC')
      .getMany();
  }

  async update(
    id: string,
    updateAppointmentDto: UpdateAppointmentDto,
    user: User,
  ): Promise<Appointment> {
    const appointment = await this.findOne(id, user);

    Object.assign(appointment, updateAppointmentDto);
    return this.appointmentRepository.save(appointment);
  }

  async cancel(id: string, user: User): Promise<Appointment> {
    const appointment = await this.findOne(id, user);

    if (appointment.status === AppointmentStatus.COMPLETED) {
      throw new BadRequestException(
        'Cannot cancel a completed appointment',
      );
    }

    appointment.status = AppointmentStatus.CANCELLED;
    return this.appointmentRepository.save(appointment);
  }

  async confirm(id: string): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    appointment.status = AppointmentStatus.CONFIRMED;
    return this.appointmentRepository.save(appointment);
  }

  async complete(id: string, doctorNotes?: string): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    appointment.status = AppointmentStatus.COMPLETED;
    if (doctorNotes) {
      appointment.doctorNotes = doctorNotes;
    }
    return this.appointmentRepository.save(appointment);
  }

  async getStatistics() {
    const total = await this.appointmentRepository.count();
    const pending = await this.appointmentRepository.count({
      where: { status: AppointmentStatus.PENDING },
    });
    const confirmed = await this.appointmentRepository.count({
      where: { status: AppointmentStatus.CONFIRMED },
    });
    const completed = await this.appointmentRepository.count({
      where: { status: AppointmentStatus.COMPLETED },
    });
    const cancelled = await this.appointmentRepository.count({
      where: { status: AppointmentStatus.CANCELLED },
    });

    return { total, pending, confirmed, completed, cancelled };
  }
}












