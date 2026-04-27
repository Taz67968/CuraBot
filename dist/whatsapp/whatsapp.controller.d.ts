import { ConfigService } from '@nestjs/config';
import { WhatsappService } from './whatsapp.service';
export declare class WhatsappController {
    private configService;
    private whatsappService;
    private readonly logger;
    constructor(configService: ConfigService, whatsappService: WhatsappService);
    verifyWebhook(mode: string, challenge: string, verifyToken: string): string;
    receiveMessage(payload: any): Promise<void>;
    private processMessage;
}
