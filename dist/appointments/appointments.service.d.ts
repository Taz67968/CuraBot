import { Repository } from 'typeorm';
import { Appointment, AppointmentStatus } from './entities/appointment.entity';
export declare class AppointmentsService {
    private appointmentRepository;
    private readonly logger;
    constructor(appointmentRepository: Repository<Appointment>);
    create(appointmentData: {
        patientId: string;
        doctorId: string;
        scheduledAt: Date;
        notes?: string;
    }): Promise<Appointment>;
    checkConflict(doctorId: string, scheduledAt: Date): Promise<boolean>;
    findById(id: string): Promise<Appointment>;
    findByPatientId(patientId: string): Promise<Appointment[]>;
    findByDoctorId(doctorId: string, date?: Date): Promise<Appointment[]>;
    updateStatus(id: string, status: AppointmentStatus): Promise<Appointment>;
    reschedule(id: string, newScheduledAt: Date): Promise<Appointment>;
    cancel(id: string): Promise<Appointment>;
    getUpcomingAppointments(hoursAhead: number): Promise<Appointment[]>;
    markReminderSent(id: string): Promise<void>;
}
