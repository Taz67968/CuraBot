import { Controller, Post, Body, Get, Logger, Param } from '@nestjs/common';
import { PatientsService } from '../patients/patients.service';
import { DoctorsService } from '../doctors/doctors.service';
import { AppointmentsService } from '../appointments/appointments.service';
import { Language } from '../patients/entities/patient.entity';

@Controller('test')
export class TestController {
  private readonly logger = new Logger(TestController.name);

  constructor(
    private patientsService: PatientsService,
    private doctorsService: DoctorsService,
    private appointmentsService: AppointmentsService,
  ) {}

  /**
   * Health check
   * GET /api/test/health
   */
  @Get('health')
  health() {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }

  /**
   * Create a test patient
   * POST /api/test/patients
   * Body: { phoneNumber: string, name?: string, language?: 'en' | 'fr' }
   */
  @Post('patients')
  async createTestPatient(
    @Body() body: { phoneNumber: string; name?: string; language?: Language },
  ) {
    this.logger.log(`Creating test patient: ${body.phoneNumber}`);
    const patient = await this.patientsService.findOrCreate(body.phoneNumber);
    if (body.name) {
      await this.patientsService.update(patient.id, { name: body.name });
    }
    if (body.language) {
      await this.patientsService.update(patient.id, { language: body.language as Language });
    }
    return { success: true, patient };
  }

  /**
   * Get patient by phone
   * GET /api/test/patients/:phoneNumber
   */
  @Get('patients/:phoneNumber')
  async getPatient(@Param('phoneNumber') phoneNumber: string) {
    const patient = await this.patientsService.findByPhoneNumber(phoneNumber);
    if (!patient) {
      return { error: 'Patient not found', phoneNumber };
    }
    return { patient };
  }

  /**
   * Create a test doctor
   * POST /api/test/doctors
   * Body: { name: string, specialization: string, phone: string }
   */
  @Post('doctors')
  async createTestDoctor(@Body() body: { name: string; specialization: string; phone: string }) {
    this.logger.log(`Creating test doctor: ${body.name}`);
    const doctor = await this.doctorsService.create(body);
    return { success: true, doctor };
  }

  /**
   * Get all doctors
   * GET /api/test/doctors
   */
  @Get('doctors')
  async getDoctors() {
    const doctors = await this.doctorsService.findAll();
    return { doctors, total: doctors.length };
  }

  /**
   * Get appointments for a patient
   * GET /api/test/appointments/patient/:patientId
   */
  @Get('appointments/patient/:patientId')
  async getPatientAppointments(@Param('patientId') patientId: string) {
    const appointments = await this.appointmentsService.findByPatientId(patientId);
    return { appointments, total: appointments.length };
  }

  /**
   * List all test endpoints
   * GET /api/test/endpoints
   */
  @Get('endpoints')
  endpoints() {
    return {
      ai: [
        {
          method: 'GET',
          path: '/api/ai/health',
          description: 'Check AI service health',
        },
        {
          method: 'POST',
          path: '/api/ai/classify-intent',
          description: 'Classify user intent',
          body: { message: 'string', history: 'Array<{role, content}>' },
        },
        {
          method: 'POST',
          path: '/api/ai/triage-symptoms',
          description: 'Perform symptom triage',
          body: { symptoms: 'string[]' },
        },
        {
          method: 'POST',
          path: '/api/ai/generate-response',
          description: 'Generate conversational response',
          body: {
            userMessage: 'string',
            context: 'Record<string, any>',
            conversationHistory: 'Array<{role, content}>',
          },
        },
        {
          method: 'POST',
          path: '/api/ai/chat',
          description: 'Complete conversation flow (intent + response)',
          body: {
            message: 'string',
            conversationHistory: 'Array<{role, content}>',
            patientContext: 'Record<string, any>',
          },
        },
      ],
      test: [
        {
          method: 'GET',
          path: '/api/test/health',
          description: 'Application health check',
        },
        {
          method: 'POST',
          path: '/api/test/patients',
          description: 'Create test patient',
          body: { phoneNumber: 'string', name: 'string?', language: '"en"|"fr"?' },
        },
        {
          method: 'GET',
          path: '/api/test/patients/:phoneNumber',
          description: 'Get patient by phone number',
        },
        {
          method: 'POST',
          path: '/api/test/doctors',
          description: 'Create test doctor',
          body: { name: 'string', specialization: 'string', phone: 'string' },
        },
        {
          method: 'GET',
          path: '/api/test/doctors',
          description: 'Get all doctors',
        },
        {
          method: 'GET',
          path: '/api/test/appointments/patient/:patientId',
          description: 'Get patient appointments',
        },
      ],
      whatsapp: [
        {
          method: 'GET',
          path: '/api/webhook',
          description: 'WhatsApp webhook verification',
          query: {
            'hub.mode': 'subscribe',
            'hub.challenge': 'string',
            'hub.verify_token': 'string',
          },
        },
        {
          method: 'POST',
          path: '/api/webhook',
          description: 'Receive WhatsApp messages',
          headers: { 'x-hub-signature-256': 'string' },
          body: 'WhatsApp webhook payload',
        },
      ],
    };
  }
}
