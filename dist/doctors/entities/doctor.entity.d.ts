import { Appointment } from '../../appointments/entities/appointment.entity';
import { Availability } from './availability.entity';
export declare class Doctor {
    id: string;
    name: string;
    specialization: string;
    phone: string;
    availability: Availability[];
    appointments: Appointment[];
}
