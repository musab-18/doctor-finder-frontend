import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto, UpdateReviewDto, DoctorReplyDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../entities/user.entity';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a review for a doctor' })
  create(@Body() createReviewDto: CreateReviewDto, @CurrentUser() user: User) {
    return this.reviewsService.create(createReviewDto, user);
  }

  @Get('doctor/:doctorId')
  @ApiOperation({ summary: 'Get all reviews for a doctor' })
  findByDoctor(@Param('doctorId') doctorId: string) {
    return this.reviewsService.findByDoctor(doctorId);
  }

  @Get('doctor/:doctorId/stats')
  @ApiOperation({ summary: 'Get review statistics for a doctor' })
  getDoctorStats(@Param('doctorId') doctorId: string) {
    return this.reviewsService.getDoctorStats(doctorId);
  }

  @Get('my-reviews')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all reviews by current user' })
  findMyReviews(@CurrentUser() user: User) {
    return this.reviewsService.findByUser(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific review' })
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a review' })
  update(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
    @CurrentUser() user: User,
  ) {
    return this.reviewsService.update(id, updateReviewDto, user);
  }

  @Patch(':id/reply')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add doctor reply to a review' })
  addReply(
    @Param('id') id: string,
    @Body() replyDto: DoctorReplyDto,
    @CurrentUser() user: User,
  ) {
    return this.reviewsService.addDoctorReply(id, replyDto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a review' })
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.reviewsService.remove(id, user);
  }
}

