"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var TestController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestController = void 0;
const common_1 = require("@nestjs/common");
const patients_service_1 = require("../patients/patients.service");
const doctors_service_1 = require("../doctors/doctors.service");
const appointments_service_1 = require("../appointments/appointments.service");
let TestController = TestController_1 = class TestController {
    constructor(patientsService, doctorsService, appointmentsService) {
        this.patientsService = patientsService;
        this.doctorsService = doctorsService;
        this.appointmentsService = appointmentsService;
        this.logger = new common_1.Logger(TestController_1.name);
    }
    health() {
        return {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
        };
    }
    async createTestPatient(body) {
        try {
            const patient = await this.patientsService.findOrCreate(body.phoneNumber);
            if (body.name) {
                await this.patientsService.update(patient.id, { name: body.name });
            }
            if (body.language) {
                await this.patientsService.update(patient.id, { language: body.language });
            }
            return {
                success: true,
                patient: {
                    id: patient.id,
                    phoneNumber: patient.phoneNumber,
                    name: patient.name,
                    language: patient.language,
                },
            };
        }
        catch (error) {
            this.logger.error(`Patient creation failed: ${error.constructor.name}`);
            throw error;
        }
    }
    async getPatient(phoneNumber) {
        const patient = await this.patientsService.findByPhoneNumber(phoneNumber);
        if (!patient) {
            return { error: 'Patient not found', phoneNumber };
        }
        return { patient };
    }
    async createTestDoctor(body) {
        this.logger.log(`Creating test doctor: ${body.name}`);
        const doctor = await this.doctorsService.create(body);
        return { success: true, doctor };
    }
    async getDoctors() {
        const doctors = await this.doctorsService.findAll();
        return { doctors, total: doctors.length };
    }
    async getPatientAppointments(patientId) {
        const appointments = await this.appointmentsService.findByPatientId(patientId);
        return { appointments, total: appointments.length };
    }
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
};
exports.TestController = TestController;
__decorate([
    (0, common_1.Get)('health'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TestController.prototype, "health", null);
__decorate([
    (0, common_1.Post)('patients'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TestController.prototype, "createTestPatient", null);
__decorate([
    (0, common_1.Get)('patients/:phoneNumber'),
    __param(0, (0, common_1.Param)('phoneNumber')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TestController.prototype, "getPatient", null);
__decorate([
    (0, common_1.Post)('doctors'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TestController.prototype, "createTestDoctor", null);
__decorate([
    (0, common_1.Get)('doctors'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TestController.prototype, "getDoctors", null);
__decorate([
    (0, common_1.Get)('appointments/patient/:patientId'),
    __param(0, (0, common_1.Param)('patientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TestController.prototype, "getPatientAppointments", null);
__decorate([
    (0, common_1.Get)('endpoints'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TestController.prototype, "endpoints", null);
exports.TestController = TestController = TestController_1 = __decorate([
    (0, common_1.Controller)('test'),
    __metadata("design:paramtypes", [patients_service_1.PatientsService,
        doctors_service_1.DoctorsService,
        appointments_service_1.AppointmentsService])
], TestController);
//# sourceMappingURL=test.controller.js.map