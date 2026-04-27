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
var RemindersProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemindersProcessor = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
const bullmq_2 = require("bullmq");
const whatsapp_service_1 = require("../whatsapp/whatsapp.service");
const appointments_service_1 = require("../appointments/appointments.service");
let RemindersProcessor = RemindersProcessor_1 = class RemindersProcessor extends bullmq_1.WorkerHost {
    constructor(whatsappService, appointmentsService) {
        super();
        this.whatsappService = whatsappService;
        this.appointmentsService = appointmentsService;
        this.logger = new common_1.Logger(RemindersProcessor_1.name);
    }
    async process(job) {
        const { appointmentId, type, patientPhone } = job.data;
        try {
            const appointment = await this.appointmentsService.findById(appointmentId);
            let message;
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
        }
        catch (error) {
            this.logger.error(`Failed to process reminder job ${job.id}`, error);
            throw error;
        }
    }
    onCompleted(job) {
        this.logger.log(`Reminder job ${job.id} completed successfully`);
    }
    onFailed(job, err) {
        this.logger.error(`Reminder job ${job.id} failed`, err);
    }
};
exports.RemindersProcessor = RemindersProcessor;
__decorate([
    (0, bullmq_1.OnWorkerEvent)('completed'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bullmq_2.Job]),
    __metadata("design:returntype", void 0)
], RemindersProcessor.prototype, "onCompleted", null);
__decorate([
    (0, bullmq_1.OnWorkerEvent)('failed'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bullmq_2.Job, Error]),
    __metadata("design:returntype", void 0)
], RemindersProcessor.prototype, "onFailed", null);
exports.RemindersProcessor = RemindersProcessor = RemindersProcessor_1 = __decorate([
    (0, bullmq_1.Processor)('reminders'),
    __metadata("design:paramtypes", [whatsapp_service_1.WhatsappService,
        appointments_service_1.AppointmentsService])
], RemindersProcessor);
//# sourceMappingURL=reminders.processor.js.map