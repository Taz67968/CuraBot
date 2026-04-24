import { Appointment } from '../../appointments/entities/appointment.entity';
export declare enum Language {
    EN = "en",
    FR = "fr"
}
export declare class Patient {
    id: string;
    phoneNumber: string;
    name: string;
    language: Language;
    createdAt: Date;
    appointments: Appointment[];
}
