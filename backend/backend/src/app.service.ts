import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor } from './entities/doctor.entity';
import { User } from './entities/user.entity';
import { Specialization } from './entities/specialization.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Specialization)
    private specializationRepository: Repository<Specialization>,
  ) {}

  getHello(): string {
    return 'Doctor Finder API is running!';
  }

  async getHealth() {
    try {
      const doctorCount = await this.doctorRepository.count();
      const userCount = await this.userRepository.count();
      const specCount = await this.specializationRepository.count();
      
      return {
        status: 'ok',
        database: 'connected',
        counts: {
          doctors: doctorCount,
          users: userCount,
          specializations: specCount,
        },
        seeded: doctorCount > 0,
      };
    } catch (error) {
      return {
        status: 'error',
        database: 'disconnected',
        error: error.message,
      };
    }
  }
}
