import { PatientsService } from '../patients/patients.service';
import { DoctorsService } from '../doctors/doctors.service';
import { AppointmentsService } from '../appointments/appointments.service';
import { Language } from '../patients/entities/patient.entity';
export declare class TestController {
    private patientsService;
    private doctorsService;
    private appointmentsService;
    private readonly logger;
    constructor(patientsService: PatientsService, doctorsService: DoctorsService, appointmentsService: AppointmentsService);
    health(): {
        status: string;
        timestamp: string;
        uptime: number;
    };
    createTestPatient(body: {
        phoneNumber: string;
        name?: string;
        language?: Language;
    }): Promise<{
        success: boolean;
        patient: import("../patients/entities/patient.entity").Patient;
    }>;
    getPatient(phoneNumber: string): Promise<{
        error: string;
        phoneNumber: string;
        patient?: undefined;
    } | {
        patient: import("../patients/entities/patient.entity").Patient;
        error?: undefined;
        phoneNumber?: undefined;
    }>;
    createTestDoctor(body: {
        name: string;
        specialization: string;
        phone: string;
    }): Promise<{
        success: boolean;
        doctor: import("../doctors/entities/doctor.entity").Doctor;
    }>;
    getDoctors(): Promise<{
        doctors: import("../doctors/entities/doctor.entity").Doctor[];
        total: number;
    }>;
    getPatientAppointments(patientId: string): Promise<{
        appointments: import("../appointments/entities/appointment.entity").Appointment[];
        total: number;
    }>;
    endpoints(): {
        ai: ({
            method: string;
            path: string;
            description: string;
            body?: undefined;
        } | {
            method: string;
            path: string;
            description: string;
            body: {
                message: string;
                history: string;
                symptoms?: undefined;
                userMessage?: undefined;
                context?: undefined;
                conversationHistory?: undefined;
                patientContext?: undefined;
            };
        } | {
            method: string;
            path: string;
            description: string;
            body: {
                symptoms: string;
                message?: undefined;
                history?: undefined;
                userMessage?: undefined;
                context?: undefined;
                conversationHistory?: undefined;
                patientContext?: undefined;
            };
        } | {
            method: string;
            path: string;
            description: string;
            body: {
                userMessage: string;
                context: string;
                conversationHistory: string;
                message?: undefined;
                history?: undefined;
                symptoms?: undefined;
                patientContext?: undefined;
            };
        } | {
            method: string;
            path: string;
            description: string;
            body: {
                message: string;
                conversationHistory: string;
                patientContext: string;
                history?: undefined;
                symptoms?: undefined;
                userMessage?: undefined;
                context?: undefined;
            };
        })[];
        test: ({
            method: string;
            path: string;
            description: string;
            body?: undefined;
        } | {
            method: string;
            path: string;
            description: string;
            body: {
                phoneNumber: string;
                name: string;
                language: string;
                specialization?: undefined;
                phone?: undefined;
            };
        } | {
            method: string;
            path: string;
            description: string;
            body: {
                name: string;
                specialization: string;
                phone: string;
                phoneNumber?: undefined;
                language?: undefined;
            };
        })[];
        whatsapp: ({
            method: string;
            path: string;
            description: string;
            query: {
                'hub.mode': string;
                'hub.challenge': string;
                'hub.verify_token': string;
            };
            headers?: undefined;
            body?: undefined;
        } | {
            method: string;
            path: string;
            description: string;
            headers: {
                'x-hub-signature-256': string;
            };
            body: string;
            query?: undefined;
        })[];
    };
}
