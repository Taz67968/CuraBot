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
var RemindersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemindersService = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
const appointments_service_1 = require("../appointments/appointments.service");
let RemindersService = RemindersService_1 = class RemindersService {
    constructor(remindersQueue, appointmentsService) {
        this.remindersQueue = remindersQueue;
        this.appointmentsService = appointmentsService;
        this.logger = new common_1.Logger(RemindersService_1.name);
    }
    async schedule24hReminder(appointmentId, scheduledAt, patientPhone) {
        const reminderTime = new Date(scheduledAt.getTime() - 24 * 60 * 60 * 1000);
        if (reminderTime > new Date()) {
            await this.remindersQueue.add('appointment-24h', { appointmentId, type: '24h', patientPhone }, { delay: reminderTime.getTime() - Date.now() });
            this.logger.log(`24h reminder scheduled for appointment ${appointmentId}`);
        }
    }
    async schedule1hReminder(appointmentId, scheduledAt, patientPhone) {
        const reminderTime = new Date(scheduledAt.getTime() - 60 * 60 * 1000);
        if (reminderTime > new Date()) {
            await this.remindersQueue.add('appointment-1h', { appointmentId, type: '1h', patientPhone }, { delay: reminderTime.getTime() - Date.now() });
            this.logger.log(`1h reminder scheduled for appointment ${appointmentId}`);
        }
    }
    async scheduleFollowupReminder(appointmentId, scheduledAt, patientPhone) {
        const reminderTime = new Date(scheduledAt.getTime() + 2 * 60 * 60 * 1000);
        await this.remindersQueue.add('followup', { appointmentId, type: 'followup', patientPhone }, { delay: reminderTime.getTime() - Date.now() });
        this.logger.log(`Follow-up reminder scheduled for appointment ${appointmentId}`);
    }
    async scheduleAppointmentReminders(appointmentId, scheduledAt, patientPhone) {
        await Promise.all([
            this.schedule24hReminder(appointmentId, scheduledAt, patientPhone),
            this.schedule1hReminder(appointmentId, scheduledAt, patientPhone),
            this.scheduleFollowupReminder(appointmentId, scheduledAt, patientPhone),
        ]);
    }
    async cancelAppointmentReminders(appointmentId) {
        const jobs = await this.remindersQueue.getJobs(['delayed', 'waiting', 'active']);
        for (const job of jobs) {
            if (job.data.appointmentId === appointmentId) {
                await job.remove();
                this.logger.log(`Reminder job ${job.id} cancelled for appointment ${appointmentId}`);
            }
        }
    }
    async getQueueStats() {
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
};
exports.RemindersService = RemindersService;
exports.RemindersService = RemindersService = RemindersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, bullmq_1.InjectQueue)('reminders')),
    __metadata("design:paramtypes", [bullmq_2.Queue,
        appointments_service_1.AppointmentsService])
], RemindersService);
//# sourceMappingURL=reminders.service.js.map