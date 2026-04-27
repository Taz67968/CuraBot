import { Doctor } from './doctor.entity';
export declare class Availability {
    id: string;
    doctorId: string;
    doctor: Doctor;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    slotDurationMinutes: number;
}
