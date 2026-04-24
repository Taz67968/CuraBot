import { Patient } from '../../patients/entities/patient.entity';
import { Doctor } from '../../doctors/entities/doctor.entity';
export declare enum AppointmentStatus {
    PENDING = "PENDING",
    CONFIRMED = "CONFIRMED",
    CANCELLED = "CANCELLED",
    COMPLETED = "COMPLETED"
}
export declare class Appointment {
    id: string;
    patientId: string;
    patient: Patient;
    doctorId: string;
    doctor: Doctor;
    scheduledAt: Date;
    status: AppointmentStatus;
    notes: string;
    reminderSent: boolean;
    createdAt: Date;
}
