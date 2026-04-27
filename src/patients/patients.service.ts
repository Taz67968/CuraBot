import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient, Language } from './entities/patient.entity';

@Injectable()
export class PatientsService {
  private readonly logger = new Logger(PatientsService.name);

  constructor(
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
  ) {}

  /**
   * Find or create a patient by phone number
   */
  async findOrCreate(phoneNumber: string, language: Language = Language.EN): Promise<Patient> {
    let patient = await this.patientRepository.findOne({ where: { phoneNumber } });

    if (!patient) {
      patient = this.patientRepository.create({
        phoneNumber,
        language,
      });
      await this.patientRepository.save(patient);
      this.logger.log(`Created new patient: ${phoneNumber}`);
    }

    return patient;
  }

  /**
   * Find patient by phone number
   */
  async findByPhoneNumber(phoneNumber: string): Promise<Patient | null> {
    return this.patientRepository.findOne({
      where: { phoneNumber },
      relations: ['appointments'],
    });
  }

  /**
   * Find patient by ID
   */
  async findById(id: string): Promise<Patient> {
    const patient = await this.patientRepository.findOne({
      where: { id },
      relations: ['appointments'],
    });

    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }

    return patient;
  }

  /**
   * Update patient information
   */
  async update(id: string, updateData: Partial<Patient>): Promise<Patient> {
    const patient = await this.findById(id);
    Object.assign(patient, updateData);
    return this.patientRepository.save(patient);
  }

  /**
   * Get all patients with pagination
   */
  async findAll(page = 1, limit = 10): Promise<[Patient[], number]> {
    return this.patientRepository.findAndCount({
      relations: ['appointments'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
  }
}
