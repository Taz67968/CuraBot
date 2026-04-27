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
var PatientsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const patient_entity_1 = require("./entities/patient.entity");
let PatientsService = PatientsService_1 = class PatientsService {
    constructor(patientRepository) {
        this.patientRepository = patientRepository;
        this.logger = new common_1.Logger(PatientsService_1.name);
    }
    async findOrCreate(phoneNumber, language = patient_entity_1.Language.EN) {
        let patient = await this.patientRepository.findOne({ where: { phoneNumber } });
        if (!patient) {
            patient = this.patientRepository.create({
                phoneNumber,
                language,
            });
            await this.patientRepository.save(patient);
            this.logger.log(`Created new patient: ${phoneNumber}`);
        }
        return patient;
    }
    async findByPhoneNumber(phoneNumber) {
        return this.patientRepository.findOne({
            where: { phoneNumber },
            relations: ['appointments'],
        });
    }
    async findById(id) {
        const patient = await this.patientRepository.findOne({
            where: { id },
            relations: ['appointments'],
        });
        if (!patient) {
            throw new common_1.NotFoundException(`Patient with ID ${id} not found`);
        }
        return patient;
    }
    async update(id, updateData) {
        const patient = await this.findById(id);
        Object.assign(patient, updateData);
        return this.patientRepository.save(patient);
    }
    async findAll(page = 1, limit = 10) {
        return this.patientRepository.findAndCount({
            relations: ['appointments'],
            skip: (page - 1) * limit,
            take: limit,
            order: { createdAt: 'DESC' },
        });
    }
};
exports.PatientsService = PatientsService;
exports.PatientsService = PatientsService = PatientsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(patient_entity_1.Patient)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PatientsService);
//# sourceMappingURL=patients.service.js.map