import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { AppointmentsService } from '../appointments/appointments.service';

export interface ReminderJobData {
  appointmentId: string;
  type: '24h' | '1h' | 'followup';
  patientPhone: string;
}

@Injectable()
export class RemindersService {
  private readonly logger = new Logger(RemindersService.name);

  constructor(
    @InjectQueue('reminders') private remindersQueue: Queue,
    private appointmentsService: AppointmentsService,
  ) {}

  /**
   * Schedule a 24-hour reminder for an appointment
   */
  async schedule24hReminder(
    appointmentId: string,
    scheduledAt: Date,
    patientPhone: string,
  ): Promise<void> {
    const reminderTime = new Date(scheduledAt.getTime() - 24 * 60 * 60 * 1000); // 24 hours before

    if (reminderTime > new Date()) {
      await this.remindersQueue.add(
        'appointment-24h',
        { appointmentId, type: '24h', patientPhone } as ReminderJobData,
        { delay: reminderTime.getTime() - Date.now() },
      );
      this.logger.log(`24h reminder scheduled for appointment ${appointmentId}`);
    }
  }

  /**
   * Schedule a 1-hour reminder for an appointment
   */
  async schedule1hReminder(
    appointmentId: string,
    scheduledAt: Date,
    patientPhone: string,
  ): Promise<void> {
    const reminderTime = new Date(scheduledAt.getTime() - 60 * 60 * 1000); // 1 hour before

    if (reminderTime > new Date()) {
      await this.remindersQueue.add(
        'appointment-1h',
        { appointmentId, type: '1h', patientPhone } as ReminderJobData,
        { delay: reminderTime.getTime() - Date.now() },
      );
      this.logger.log(`1h reminder scheduled for appointment ${appointmentId}`);
    }
  }

  /**
   * Schedule a follow-up reminder after appointment
   */
  async scheduleFollowupReminder(
    appointmentId: string,
    scheduledAt: Date,
    patientPhone: string,
  ): Promise<void> {
    const reminderTime = new Date(scheduledAt.getTime() + 2 * 60 * 60 * 1000); // 2 hours after

    await this.remindersQueue.add(
      'followup',
      { appointmentId, type: 'followup', patientPhone } as ReminderJobData,
      { delay: reminderTime.getTime() - Date.now() },
    );
    this.logger.log(`Follow-up reminder scheduled for appointment ${appointmentId}`);
  }

  /**
   * Schedule all reminders for a new appointment
   */
  async scheduleAppointmentReminders(
    appointmentId: string,
    scheduledAt: Date,
    patientPhone: string,
  ): Promise<void> {
    await Promise.all([
      this.schedule24hReminder(appointmentId, scheduledAt, patientPhone),
      this.schedule1hReminder(appointmentId, scheduledAt, patientPhone),
      this.scheduleFollowupReminder(appointmentId, scheduledAt, patientPhone),
    ]);
  }

  /**
   * Cancel all reminders for an appointment
   */
  async cancelAppointmentReminders(appointmentId: string): Promise<void> {
    const jobs = await this.remindersQueue.getJobs(['delayed', 'waiting', 'active']);

    for (const job of jobs) {
      if (job.data.appointmentId === appointmentId) {
        await job.remove();
        this.logger.log(`Reminder job ${job.id} cancelled for appointment ${appointmentId}`);
      }
    }
  }

  /**
   * Get queue statistics
   */
  async getQueueStats(): Promise<any> {
    const [waiting, active, completed, failed, delayed] = await Promise.all([
      this.remindersQueue.getWaiting(),
      this.remindersQueue.getActive(),
      this.remindersQueue.getCompleted(),
      this.remindersQueue.getFailed(),
      this.remindersQueue.getDelayed(),
    ]);

    return {
      waiting: waiting.length,
      active: active.length,
      completed: completed.length,
      failed: failed.length,
      delayed: delayed.length,
    };
  }
}
