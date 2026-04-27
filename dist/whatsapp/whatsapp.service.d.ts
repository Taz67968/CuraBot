import { ConfigService } from '@nestjs/config';
export interface WhatsAppMessage {
    to: string;
    text?: string;
    type?: 'text' | 'button' | 'interactive';
    buttons?: Array<{
        id: string;
        title: string;
    }>;
}
export declare class WhatsappService {
    private configService;
    private readonly logger;
    private readonly httpClient;
    constructor(configService: ConfigService);
    sendMessage(message: WhatsAppMessage): Promise<void>;
    sendTextMessage(to: string, text: string): Promise<void>;
}
