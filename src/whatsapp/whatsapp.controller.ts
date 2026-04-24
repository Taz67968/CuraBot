import { Controller, Get, Post, Body, Query, UseGuards, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WhatsappService } from './whatsapp.service';
import { WhatsappGuard } from './whatsapp.guard';

@Controller('webhook')
export class WhatsappController {
  private readonly logger = new Logger(WhatsappController.name);

  constructor(
    private configService: ConfigService,
    private whatsappService: WhatsappService,
  ) {}

  /**
   * WhatsApp webhook verification endpoint
   * GET /webhook?hub.mode=subscribe&hub.challenge=challenge&hub.verify_token=token
   */
  @Get()
  verifyWebhook(
    @Query('hub.mode') mode: string,
    @Query('hub.challenge') challenge: string,
    @Query('hub.verify_token') verifyToken: string,
  ): string {
    const expectedToken = this.configService.get<string>('WHATSAPP_WEBHOOK_VERIFY_TOKEN');

    if (mode === 'subscribe' && verifyToken === expectedToken) {
      this.logger.log('Webhook verified successfully');
      return challenge;
    }

    throw new Error('Webhook verification failed');
  }

  /**
   * WhatsApp webhook message receiver
   * POST /webhook
   */
  @Post()
  @UseGuards(WhatsappGuard)
  async receiveMessage(@Body() payload: any): Promise<void> {
    this.logger.log('Received WhatsApp webhook payload', payload);

    // Extract messages from payload
    const entries = payload.entry || [];
    for (const entry of entries) {
      const changes = entry.changes || [];
      for (const change of changes) {
        if (change.field === 'messages') {
          const messages = change.value.messages || [];
          for (const message of messages) {
            await this.processMessage(message, change.value);
          }
        }
      }
    }
  }

  /**
   * Process individual WhatsApp message
   */
  private async processMessage(message: any, _value: any): Promise<void> {
    const phoneNumber = message.from;
    const messageType = message.type;

    this.logger.log(`Processing message from ${phoneNumber}, type: ${messageType}`);

    // For now, just echo back a simple response
    // In the full implementation, this will integrate with AI and session management
    if (messageType === 'text') {
      const text = message.text.body;
      await this.whatsappService.sendTextMessage(
        phoneNumber,
        `Hello! You said: "${text}". This is CuraBot responding.`,
      );
    }
  }
}
