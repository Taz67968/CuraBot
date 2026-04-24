import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { WhatsappService } from '../whatsapp/whatsapp.service';
import { AppointmentsService } from '../appointments/appointments.service';
import { ReminderJobData } from './reminders.service';

@Processor('reminders')
export class RemindersProcessor extends WorkerHost {
  private readonly logger = new Logger(RemindersProcessor.name);

  constructor(
    private whatsappService: WhatsappService,
    private appointmentsService: AppointmentsService,
  ) {
    super();
  }

  async process(job: Job<ReminderJobData>): Promise<void> {
    const { appointmentId, type, patientPhone } = job.data;

    try {
      const appointment = await this.appointmentsService.findById(appointmentId);

      let message: string;
      switch (type) {
        case '24h':
          message = `Reminder: You have an appointment tomorrow at ${appointment.scheduledAt.toLocaleTimeString()} with Dr. ${appointment.doctor.name}.`;
          break;
        case '1h':
          message = `Reminder: You have an appointment in 1 hour at ${appointment.scheduledAt.toLocaleTimeString()} with Dr. ${appointment.doctor.name}.`;
          break;
        case 'followup':
          message = `How was your appointment with Dr. ${appointment.doctor.name}? Please let us know if you need any follow-up care.`;
          break;
        default:
          message = 'Appointment reminder';
      }

      await this.whatsappService.sendTextMessage(patientPhone, message);

      if (type === '24h' || type === '1h') {
        await this.appointmentsService.markReminderSent(appointmentId);
      }

      this.logger.log(`Reminder sent: ${type} for appointment ${appointmentId}`);
    } catch (error) {
      this.logger.error(`Failed to process reminder job ${job.id}`, error);
      throw error;
    }
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job<ReminderJobData>) {
    this.logger.log(`Reminder job ${job.id} completed successfully`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job<ReminderJobData>, err: Error) {
    this.logger.error(`Reminder job ${job.id} failed`, err);
  }
}
