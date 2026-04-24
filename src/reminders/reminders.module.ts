import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { RemindersService } from './reminders.service';
import { RemindersProcessor } from './reminders.processor';
import { WhatsappModule } from '../whatsapp/whatsapp.module';
import { AppointmentsModule } from '../appointments/appointments.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'reminders',
    }),
    WhatsappModule,
    AppointmentsModule,
  ],
  providers: [RemindersService, RemindersProcessor],
  exports: [RemindersService],
})
export class RemindersModule {}
