import { Queue } from 'bullmq';
import { AppointmentsService } from '../appointments/appointments.service';
export interface ReminderJobData {
    appointmentId: string;
    type: '24h' | '1h' | 'followup';
    patientPhone: string;
}
export declare class RemindersService {
    private remindersQueue;
    private appointmentsService;
    private readonly logger;
    constructor(remindersQueue: Queue, appointmentsService: AppointmentsService);
    schedule24hReminder(appointmentId: string, scheduledAt: Date, patientPhone: string): Promise<void>;
    schedule1hReminder(appointmentId: string, scheduledAt: Date, patientPhone: string): Promise<void>;
    scheduleFollowupReminder(appointmentId: string, scheduledAt: Date, patientPhone: string): Promise<void>;
    scheduleAppointmentReminders(appointmentId: string, scheduledAt: Date, patientPhone: string): Promise<void>;
    cancelAppointmentReminders(appointmentId: string): Promise<void>;
    getQueueStats(): Promise<any>;
}
