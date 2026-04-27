import { Language } from '../entities/patient.entity';
export declare class CreatePatientDto {
    phoneNumber: string;
    name?: string;
    language?: Language;
}
export declare class UpdatePatientDto {
    name?: string;
    language?: Language;
}
