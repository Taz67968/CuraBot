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
var DoctorsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const doctor_entity_1 = require("./entities/doctor.entity");
const availability_entity_1 = require("./entities/availability.entity");
let DoctorsService = DoctorsService_1 = class DoctorsService {
    constructor(doctorRepository, availabilityRepository) {
        this.doctorRepository = doctorRepository;
        this.availabilityRepository = availabilityRepository;
        this.logger = new common_1.Logger(DoctorsService_1.name);
    }
    async findAll() {
        return this.doctorRepository.find({
            relations: ['availability', 'appointments'],
        });
    }
    async findById(id) {
        const doctor = await this.doctorRepository.findOne({
            where: { id },
            relations: ['availability', 'appointments'],
        });
        if (!doctor) {
            throw new common_1.NotFoundException(`Doctor with ID ${id} not found`);
        }
        return doctor;
    }
    async findBySpecialization(specialization) {
        return this.doctorRepository.find({
            where: { specialization },
            relations: ['availability'],
        });
    }
    async getAvailableSlots(doctorId, date) {
        const doctor = await this.findById(doctorId);
        const dayOfWeek = date.getDay();
        const availability = doctor.availability.find((avail) => avail.dayOfWeek === dayOfWeek);
        if (!availability) {
            return [];
        }
        const slots = [];
        const startTime = new Date(`${date.toDateString()} ${availability.startTime}`);
        const endTime = new Date(`${date.toDateString()} ${availability.endTime}`);
        const slotDuration = availability.slotDurationMinutes * 60 * 1000;
        let currentTime = startTime;
        while (currentTime < endTime) {
            slots.push(currentTime.toTimeString().slice(0, 5));
            currentTime = new Date(currentTime.getTime() + slotDuration);
        }
        return slots;
    }
    async create(doctorData) {
        const doctor = this.doctorRepository.create(doctorData);
        return this.doctorRepository.save(doctor);
    }
    async update(id, updateData) {
        const doctor = await this.findById(id);
        Object.assign(doctor, updateData);
        return this.doctorRepository.save(doctor);
    }
    async addAvailability(doctorId, availabilityData) {
        const availability = this.availabilityRepository.create({
            ...availabilityData,
            doctorId,
        });
        return this.availabilityRepository.save(availability);
    }
};
exports.DoctorsService = DoctorsService;
exports.DoctorsService = DoctorsService = DoctorsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(doctor_entity_1.Doctor)),
    __param(1, (0, typeorm_1.InjectRepository)(availability_entity_1.Availability)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], DoctorsService);
//# sourceMappingURL=doctors.service.js.map