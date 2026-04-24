import { IsString, IsOptional, IsEnum } from 'class-validator';
import { Language } from '../entities/patient.entity';

export class CreatePatientDto {
  @IsString()
  phoneNumber: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(Language)
  language?: Language;
}

export class UpdatePatientDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(Language)
  language?: Language;
}
