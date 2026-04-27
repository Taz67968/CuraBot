import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { WhatsappService } from '../whatsapp/whatsapp.service';
import { AppointmentsService } from '../appointments/appointments.service';
import { ReminderJobData } from './reminders.service';
export declare class RemindersProcessor extends WorkerHost {
    private whatsappService;
    private appointmentsService;
    private readonly logger;
    constructor(whatsappService: WhatsappService, appointmentsService: AppointmentsService);
    process(job: Job<ReminderJobData>): Promise<void>;
    onCompleted(job: Job<ReminderJobData>): void;
    onFailed(job: Job<ReminderJobData>, err: Error): void;
}
