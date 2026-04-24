import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

export interface WhatsAppMessage {
  to: string;
  text?: string;
  type?: 'text' | 'button' | 'interactive';
  buttons?: Array<{ id: string; title: string }>;
}

@Injectable()
export class WhatsappService {
  private readonly logger = new Logger(WhatsappService.name);
  private readonly httpClient: AxiosInstance;

  constructor(private configService: ConfigService) {
    this.httpClient = axios.create({
      baseURL: `https://graph.facebook.com/v18.0/${this.configService.get<string>('WHATSAPP_PHONE_NUMBER_ID')}/messages`,
      headers: {
        Authorization: `Bearer ${this.configService.get<string>('WHATSAPP_ACCESS_TOKEN')}`,
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Send a text message to a WhatsApp user
   */
  async sendMessage(message: WhatsAppMessage): Promise<void> {
    try {
      const payload: any = {
        messaging_product: 'whatsapp',
        to: message.to,
        type: message.type || 'text',
      };

      if (message.type === 'interactive' && message.buttons) {
        payload.interactive = {
          type: 'button',
          body: { text: message.text },
          action: {
            buttons: message.buttons.map((btn) => ({
              type: 'reply',
              reply: { id: btn.id, title: btn.title },
            })),
          },
        };
      } else {
        payload.text = { body: message.text };
      }

      await this.httpClient.post('', payload);
      this.logger.log(`Message sent to ${message.to}`);
    } catch (error) {
      this.logger.error(`Failed to send message to ${message.to}`, error);
      throw error;
    }
  }

  /**
   * Send a simple text message
   */
  async sendTextMessage(to: string, text: string): Promise<void> {
    await this.sendMessage({ to, text });
  }
}
