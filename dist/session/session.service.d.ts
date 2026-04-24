import { RedisService } from '@liaoliaots/nestjs-redis';
export interface SessionData {
    patientId?: string;
    currentFlow: string;
    pendingData: Record<string, any>;
    messageHistory: Array<{
        role: 'user' | 'assistant';
        content: string;
    }>;
    language: 'en' | 'fr';
    lastActivity: string;
}
export declare class SessionService {
    private readonly redisService;
    private readonly logger;
    private readonly redis;
    constructor(redisService: RedisService);
    getSession(phoneNumber: string): Promise<SessionData | null>;
    setSession(phoneNumber: string, sessionData: SessionData): Promise<void>;
    updateSession(phoneNumber: string, updates: Partial<SessionData>): Promise<void>;
    addMessageToHistory(phoneNumber: string, role: 'user' | 'assistant', content: string): Promise<void>;
    clearSession(phoneNumber: string): Promise<void>;
}
