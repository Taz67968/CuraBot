import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorsService } from './doctors.service';
import { Doctor } from './entities/doctor.entity';
import { Availability } from './entities/availability.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Doctor, Availability])],
  providers: [DoctorsService],
  exports: [DoctorsService],
})
export class DoctorsModule {}
