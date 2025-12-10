import { IsString, IsOptional, IsEnum } from 'class-validator';
import { AppointmentStatus } from '../../entities/appointment.entity';

export class UpdateAppointmentDto {
  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;

  @IsOptional()
  @IsString()
  doctorNotes?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}











