import { Repository } from 'typeorm';
import { Patient, Language } from './entities/patient.entity';
export declare class PatientsService {
    private patientRepository;
    private readonly logger;
    constructor(patientRepository: Repository<Patient>);
    findOrCreate(phoneNumber: string, language?: Language): Promise<Patient>;
    findByPhoneNumber(phoneNumber: string): Promise<Patient | null>;
    findById(id: string): Promise<Patient>;
    update(id: string, updateData: Partial<Patient>): Promise<Patient>;
    findAll(page?: number, limit?: number): Promise<[Patient[], number]>;
}
