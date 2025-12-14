import { IsString, IsUUID, IsInt, Min, Max, IsOptional } from 'class-validator';

export class CreateReviewDto {
  @IsUUID()
  doctorId: string;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsOptional()
  @IsUUID()
  appointmentId?: string;
}

