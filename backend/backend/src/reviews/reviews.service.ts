import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '../entities/review.entity';
import { Doctor } from '../entities/doctor.entity';
import { Appointment, AppointmentStatus } from '../entities/appointment.entity';
import { User, UserRole } from '../entities/user.entity';
import { CreateReviewDto, UpdateReviewDto, DoctorReplyDto } from './dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
  ) {}

  async create(createReviewDto: CreateReviewDto, user: User): Promise<Review> {
    // Check if doctor exists
    const doctor = await this.doctorRepository.findOne({
      where: { id: createReviewDto.doctorId },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    // Check if user already reviewed this doctor
    const existingReview = await this.reviewRepository.findOne({
      where: {
        userId: user.id,
        doctorId: createReviewDto.doctorId,
      },
    });

    if (existingReview) {
      throw new BadRequestException('You have already reviewed this doctor');
    }

    let isVerified = false;

    // If appointmentId provided, verify it's a completed appointment
    if (createReviewDto.appointmentId) {
      const appointment = await this.appointmentRepository.findOne({
        where: {
          id: createReviewDto.appointmentId,
          userId: user.id,
          doctorId: createReviewDto.doctorId,
          status: AppointmentStatus.COMPLETED,
        },
      });

      if (appointment) {
        isVerified = true;
      }
    }

    const review = this.reviewRepository.create({
      ...createReviewDto,
      userId: user.id,
      isVerified,
    });

    const savedReview = await this.reviewRepository.save(review);

    // Update doctor's average rating
    await this.updateDoctorRating(createReviewDto.doctorId);

    return savedReview;
  }

  async findByDoctor(doctorId: string) {
    return this.reviewRepository.find({
      where: { doctorId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByUser(userId: string) {
    return this.reviewRepository.find({
      where: { userId },
      relations: ['doctor', 'doctor.specialization'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Review> {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: ['user', 'doctor'],
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return review;
  }

  async update(id: string, updateReviewDto: UpdateReviewDto, user: User): Promise<Review> {
    const review = await this.findOne(id);

    if (review.userId !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('You can only edit your own reviews');
    }

    Object.assign(review, updateReviewDto);
    const updatedReview = await this.reviewRepository.save(review);

    // Update doctor's average rating
    await this.updateDoctorRating(review.doctorId);

    return updatedReview;
  }

  async addDoctorReply(id: string, replyDto: DoctorReplyDto, user: User): Promise<Review> {
    const review = await this.findOne(id);

    // Only admin can reply (in a real app, you'd check if user is the doctor)
    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only doctors can reply to reviews');
    }

    review.doctorReply = replyDto.doctorReply;
    return this.reviewRepository.save(review);
  }

  async remove(id: string, user: User): Promise<void> {
    const review = await this.findOne(id);

    if (review.userId !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('You can only delete your own reviews');
    }

    const doctorId = review.doctorId;
    await this.reviewRepository.remove(review);

    // Update doctor's average rating
    await this.updateDoctorRating(doctorId);
  }

  async getDoctorStats(doctorId: string) {
    const reviews = await this.reviewRepository.find({
      where: { doctorId },
    });

    const total = reviews.length;
    if (total === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      };
    }

    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    const averageRating = Number((sum / total).toFixed(1));

    const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      ratingDistribution[r.rating]++;
    });

    return {
      averageRating,
      totalReviews: total,
      ratingDistribution,
    };
  }

  private async updateDoctorRating(doctorId: string): Promise<void> {
    const stats = await this.getDoctorStats(doctorId);

    await this.doctorRepository.update(doctorId, {
      rating: stats.averageRating,
      reviewCount: stats.totalReviews,
    });
  }
}

