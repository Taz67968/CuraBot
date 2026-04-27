import { Injectable, Logger, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Appointment, AppointmentStatus } from './entities/appointment.entity';

@Injectable()
export class AppointmentsService {
  private readonly logger = new Logger(AppointmentsService.name);

  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
  ) {}

  /**
   * Create a new appointment with conflict checking
   */
  async create(appointmentData: {
    patientId: string;
    doctorId: string;
    scheduledAt: Date;
    notes?: string;
  }): Promise<Appointment> {
    // Check for conflicts
    const conflict = await this.checkConflict(
      appointmentData.doctorId,
      appointmentData.scheduledAt,
    );

    if (conflict) {
      throw new ConflictException('Time slot is already booked');
    }

    const appointment = this.appointmentRepository.create({
      ...appointmentData,
      status: AppointmentStatus.PENDING,
    });

    const savedAppointment = await this.appointmentRepository.save(appointment);
    this.logger.log(`Appointment created: ${savedAppointment.id}`);
    return savedAppointment;
  }

  /**
   * Check for scheduling conflicts
   */
  async checkConflict(doctorId: string, scheduledAt: Date): Promise<boolean> {
    const startTime = new Date(scheduledAt);
    const endTime = new Date(scheduledAt.getTime() + 30 * 60 * 1000); // Assume 30-minute slots

    const conflictingAppointment = await this.appointmentRepository.findOne({
      where: {
        doctorId,
        scheduledAt: Between(startTime, endTime),
        status: AppointmentStatus.CONFIRMED,
      },
    });

    return !!conflictingAppointment;
  }

  /**
   * Find appointment by ID
   */
  async findById(id: string): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      relations: ['patient', 'doctor'],
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    return appointment;
  }

  /**
   * Find appointments by patient ID
   */
  async findByPatientId(patientId: string): Promise<Appointment[]> {
    return this.appointmentRepository.find({
      where: { patientId },
      relations: ['doctor'],
      order: { scheduledAt: 'ASC' },
    });
  }

  /**
   * Find appointments by doctor ID
   */
  async findByDoctorId(doctorId: string, date?: Date): Promise<Appointment[]> {
    const where: any = { doctorId };

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      where.scheduledAt = Between(startOfDay, endOfDay);
    }

    return this.appointmentRepository.find({
      where,
      relations: ['patient'],
      order: { scheduledAt: 'ASC' },
    });
  }

  /**
   * Update appointment status
   */
  async updateStatus(id: string, status: AppointmentStatus): Promise<Appointment> {
    const appointment = await this.findById(id);
    appointment.status = status;
    return this.appointmentRepository.save(appointment);
  }

  /**
   * Reschedule appointment
   */
  async reschedule(id: string, newScheduledAt: Date): Promise<Appointment> {
    const appointment = await this.findById(id);

    // Check for conflicts at new time
    const conflict = await this.checkConflict(appointment.doctorId, newScheduledAt);
    if (conflict) {
      throw new ConflictException('New time slot is already booked');
    }

    appointment.scheduledAt = newScheduledAt;
    appointment.status = AppointmentStatus.PENDING; // Reset to pending for confirmation

    return this.appointmentRepository.save(appointment);
  }

  /**
   * Cancel appointment
   */
  async cancel(id: string): Promise<Appointment> {
    return this.updateStatus(id, AppointmentStatus.CANCELLED);
  }

  /**
   * Get upcoming appointments for reminders
   */
  async getUpcomingAppointments(hoursAhead: number): Promise<Appointment[]> {
    const now = new Date();
    const futureTime = new Date(now.getTime() + hoursAhead * 60 * 60 * 1000);

    return this.appointmentRepository.find({
      where: {
        scheduledAt: Between(now, futureTime),
        status: AppointmentStatus.CONFIRMED,
        reminderSent: false,
      },
      relations: ['patient', 'doctor'],
      order: { scheduledAt: 'ASC' },
    });
  }

  /**
   * Mark reminder as sent
   */
  async markReminderSent(id: string): Promise<void> {
    await this.appointmentRepository.update(id, { reminderSent: true });
  }
}
