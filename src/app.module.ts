import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { WhatsappModule } from './whatsapp/whatsapp.module';
import { AiModule } from './ai/ai.module';
import { SessionModule } from './session/session.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { PatientsModule } from './patients/patients.module';
import { DoctorsModule } from './doctors/doctors.module';
import { RemindersModule } from './reminders/reminders.module';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { validationSchema } from './config/validation.schema';

@Module({
  imports: [
    // Global configuration with validation
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
      envFilePath: ['.env.local', '.env'],
    }),

    // Rate limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 10, // 10 requests per minute per IP
      },
    ]),

    // Database connection
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        const dbUrl = process.env.DATABASE_URL || '';
        const isSqlite = dbUrl.startsWith('sqlite:');

        return {
          type: isSqlite ? 'sqlite' : 'postgres',
          url: dbUrl,
          database: isSqlite ? dbUrl.replace('sqlite:', '') : undefined,
          autoLoadEntities: true,
          synchronize: process.env.NODE_ENV !== 'production',
          logging: false, // Disable SQL query logging
        };
      },
    }),

    // Redis queue for reminders (optional - disable in environments without Redis)
    ...(process.env.REDIS_ENABLED !== 'false'
      ? [
          BullModule.forRoot({
            connection: {
              host: process.env.REDIS_HOST || 'localhost',
              port: parseInt(process.env.REDIS_PORT || '6379', 10),
            },
          }),
        ]
      : []),

    // Feature modules
    CommonModule,
    WhatsappModule,
    AiModule,
    SessionModule,
    PatientsModule,
    DoctorsModule,
    AppointmentsModule,
    RemindersModule,
    AuthModule,
  ],
})
export class AppModule {}
