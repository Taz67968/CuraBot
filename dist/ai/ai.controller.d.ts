import { AiService, IntentResult, TriageResult } from './ai.service';
export declare class AiController {
    private aiService;
    private readonly logger;
    constructor(aiService: AiService);
    health(): {
        status: string;
        service: string;
        timestamp: string;
    };
    classifyIntent(body: {
        message: string;
        history?: Array<{
            role: string;
            content: string;
        }>;
    }): Promise<IntentResult>;
    triageSymptoms(body: {
        symptoms: string[];
    }): Promise<TriageResult>;
    generateResponse(body: {
        userMessage: string;
        context?: Record<string, any>;
        conversationHistory?: Array<{
            role: string;
            content: string;
        }>;
    }): Promise<{
        response: string;
    }>;
    chat(body: {
        message: string;
        conversationHistory?: Array<{
            role: string;
            content: string;
        }>;
        patientContext?: Record<string, any>;
    }): Promise<{
        intent: IntentResult;
        response: string;
        confidence: number;
        nextAction: string;
    }>;
}
