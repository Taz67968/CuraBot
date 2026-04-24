import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Doctor } from './doctor.entity';

@Entity('availability')
export class Availability {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  doctorId: string;

  @ManyToOne(() => Doctor, (doctor) => doctor.availability)
  @JoinColumn({ name: 'doctorId' })
  doctor: Doctor;

  @Column('int')
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.

  @Column('time')
  startTime: string; // HH:MM format

  @Column('time')
  endTime: string; // HH:MM format

  @Column('int')
  slotDurationMinutes: number;
}
