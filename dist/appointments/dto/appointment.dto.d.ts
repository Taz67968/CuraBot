import { AppointmentStatus } from '../entities/appointment.entity';
export declare class CreateAppointmentDto {
    patientId: string;
    doctorId: string;
    scheduledAt: string;
    notes?: string;
}
export declare class UpdateAppointmentDto {
    scheduledAt?: string;
    status?: AppointmentStatus;
    notes?: string;
}
