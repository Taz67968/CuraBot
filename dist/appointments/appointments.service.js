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
var AppointmentsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const appointment_entity_1 = require("./entities/appointment.entity");
let AppointmentsService = AppointmentsService_1 = class AppointmentsService {
    constructor(appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
        this.logger = new common_1.Logger(AppointmentsService_1.name);
    }
    async create(appointmentData) {
        const conflict = await this.checkConflict(appointmentData.doctorId, appointmentData.scheduledAt);
        if (conflict) {
            throw new common_1.ConflictException('Time slot is already booked');
        }
        const appointment = this.appointmentRepository.create({
            ...appointmentData,
            status: appointment_entity_1.AppointmentStatus.PENDING,
        });
        const savedAppointment = await this.appointmentRepository.save(appointment);
        this.logger.log(`Appointment created: ${savedAppointment.id}`);
        return savedAppointment;
    }
    async checkConflict(doctorId, scheduledAt) {
        const startTime = new Date(scheduledAt);
        const endTime = new Date(scheduledAt.getTime() + 30 * 60 * 1000);
        const conflictingAppointment = await this.appointmentRepository.findOne({
            where: {
                doctorId,
                scheduledAt: (0, typeorm_2.Between)(startTime, endTime),
                status: appointment_entity_1.AppointmentStatus.CONFIRMED,
            },
        });
        return !!conflictingAppointment;
    }
    async findById(id) {
        const appointment = await this.appointmentRepository.findOne({
            where: { id },
            relations: ['patient', 'doctor'],
        });
        if (!appointment) {
            throw new common_1.NotFoundException(`Appointment with ID ${id} not found`);
        }
        return appointment;
    }
    async findByPatientId(patientId) {
        return this.appointmentRepository.find({
            where: { patientId },
            relations: ['doctor'],
            order: { scheduledAt: 'ASC' },
        });
    }
    async findByDoctorId(doctorId, date) {
        const where = { doctorId };
        if (date) {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);
            where.scheduledAt = (0, typeorm_2.Between)(startOfDay, endOfDay);
        }
        return this.appointmentRepository.find({
            where,
            relations: ['patient'],
            order: { scheduledAt: 'ASC' },
        });
    }
    async updateStatus(id, status) {
        const appointment = await this.findById(id);
        appointment.status = status;
        return this.appointmentRepository.save(appointment);
    }
    async reschedule(id, newScheduledAt) {
        const appointment = await this.findById(id);
        const conflict = await this.checkConflict(appointment.doctorId, newScheduledAt);
        if (conflict) {
            throw new common_1.ConflictException('New time slot is already booked');
        }
        appointment.scheduledAt = newScheduledAt;
        appointment.status = appointment_entity_1.AppointmentStatus.PENDING;
        return this.appointmentRepository.save(appointment);
    }
    async cancel(id) {
        return this.updateStatus(id, appointment_entity_1.AppointmentStatus.CANCELLED);
    }
    async getUpcomingAppointments(hoursAhead) {
        const now = new Date();
        const futureTime = new Date(now.getTime() + hoursAhead * 60 * 60 * 1000);
        return this.appointmentRepository.find({
            where: {
                scheduledAt: (0, typeorm_2.Between)(now, futureTime),
                status: appointment_entity_1.AppointmentStatus.CONFIRMED,
                reminderSent: false,
            },
            relations: ['patient', 'doctor'],
            order: { scheduledAt: 'ASC' },
        });
    }
    async markReminderSent(id) {
        await this.appointmentRepository.update(id, { reminderSent: true });
    }
};
exports.AppointmentsService = AppointmentsService;
exports.AppointmentsService = AppointmentsService = AppointmentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(appointment_entity_1.Appointment)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AppointmentsService);
//# sourceMappingURL=appointments.service.js.map