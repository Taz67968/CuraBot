import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor } from './entities/doctor.entity';
import { Availability } from './entities/availability.entity';

@Injectable()
export class DoctorsService {
  private readonly logger = new Logger(DoctorsService.name);

  constructor(
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
    @InjectRepository(Availability)
    private availabilityRepository: Repository<Availability>,
  ) {}

  /**
   * Find all doctors
   */
  async findAll(): Promise<Doctor[]> {
    return this.doctorRepository.find({
      relations: ['availability', 'appointments'],
    });
  }

  /**
   * Find doctor by ID
   */
  async findById(id: string): Promise<Doctor> {
    const doctor = await this.doctorRepository.findOne({
      where: { id },
      relations: ['availability', 'appointments'],
    });

    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${id} not found`);
    }

    return doctor;
  }

  /**
   * Find doctors by specialization
   */
  async findBySpecialization(specialization: string): Promise<Doctor[]> {
    return this.doctorRepository.find({
      where: { specialization },
      relations: ['availability'],
    });
  }

  /**
   * Get available time slots for a doctor on a specific date
   */
  async getAvailableSlots(doctorId: string, date: Date): Promise<string[]> {
    const doctor = await this.findById(doctorId);
    const dayOfWeek = date.getDay();

    const availability = doctor.availability.find((avail) => avail.dayOfWeek === dayOfWeek);

    if (!availability) {
      return [];
    }

    // This is a simplified implementation
    // In a real app, you'd check existing appointments and generate slots
    const slots: string[] = [];
    const startTime = new Date(`${date.toDateString()} ${availability.startTime}`);
    const endTime = new Date(`${date.toDateString()} ${availability.endTime}`);
    const slotDuration = availability.slotDurationMinutes * 60 * 1000; // in milliseconds

    let currentTime = startTime;
    while (currentTime < endTime) {
      slots.push(currentTime.toTimeString().slice(0, 5)); // HH:MM format
      currentTime = new Date(currentTime.getTime() + slotDuration);
    }

    return slots;
  }

  /**
   * Create a new doctor
   */
  async create(doctorData: Partial<Doctor>): Promise<Doctor> {
    const doctor = this.doctorRepository.create(doctorData);
    return this.doctorRepository.save(doctor);
  }

  /**
   * Update doctor information
   */
  async update(id: string, updateData: Partial<Doctor>): Promise<Doctor> {
    const doctor = await this.findById(id);
    Object.assign(doctor, updateData);
    return this.doctorRepository.save(doctor);
  }

  /**
   * Add availability for a doctor
   */
  async addAvailability(
    doctorId: string,
    availabilityData: Omit<Availability, 'id' | 'doctorId' | 'doctor'>,
  ): Promise<Availability> {
    const availability = this.availabilityRepository.create({
      ...availabilityData,
      doctorId,
    });
    return this.availabilityRepository.save(availability);
  }
}
