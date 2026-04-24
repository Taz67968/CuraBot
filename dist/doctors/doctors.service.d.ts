import { Repository } from 'typeorm';
import { Doctor } from './entities/doctor.entity';
import { Availability } from './entities/availability.entity';
export declare class DoctorsService {
    private doctorRepository;
    private availabilityRepository;
    private readonly logger;
    constructor(doctorRepository: Repository<Doctor>, availabilityRepository: Repository<Availability>);
    findAll(): Promise<Doctor[]>;
    findById(id: string): Promise<Doctor>;
    findBySpecialization(specialization: string): Promise<Doctor[]>;
    getAvailableSlots(doctorId: string, date: Date): Promise<string[]>;
    create(doctorData: Partial<Doctor>): Promise<Doctor>;
    update(id: string, updateData: Partial<Doctor>): Promise<Doctor>;
    addAvailability(doctorId: string, availabilityData: Omit<Availability, 'id' | 'doctorId' | 'doctor'>): Promise<Availability>;
}
