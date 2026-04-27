import { ConfigService } from '@nestjs/config';
import { PromptsService } from './prompts/prompts.service';
export interface IntentResult {
    intent: 'BOOK_APPOINTMENT' | 'CANCEL_APPOINTMENT' | 'RESCHEDULE' | 'SYMPTOM_CHECK' | 'STATUS_CHECK' | 'HUMAN_HANDOFF' | 'UNKNOWN';
    confidence: number;
    entities: {
        date?: string;
        time?: string;
        specialty?: string;
        symptoms?: string[];
    };
    language: 'en' | 'fr';
    nextStep: string;
}
export interface TriageResult {
    severity: 'LOW' | 'MEDIUM' | 'HIGH';
    recommendation: string;
    emergency: boolean;
    followUp: string;
}
export declare class AiService {
    private configService;
    private promptsService;
    private readonly logger;
    private readonly openai;
    constructor(configService: ConfigService, promptsService: PromptsService);
    classifyIntent(message: string, conversationHistory: Array<{
        role: string;
        content: string;
    }>): Promise<IntentResult>;
    triageSymptoms(symptoms: string[]): Promise<TriageResult>;
    generateResponse(context: any): Promise<string>;
}
