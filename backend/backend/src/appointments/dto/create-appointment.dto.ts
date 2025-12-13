import { IsString, IsUUID, IsDateString, IsOptional } from 'class-validator';

export class CreateAppointmentDto {
  @IsUUID()
  doctorId: string;

  @IsDateString()
  appointmentDate: string;

  @IsString()
  appointmentTime: string;

  @IsOptional()
  @IsString()
  symptoms?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}












