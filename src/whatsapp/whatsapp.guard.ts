import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac } from 'crypto';

@Injectable()
export class WhatsappGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const signature = request.headers['x-hub-signature-256'];

    if (!signature) {
      return false;
    }

    const appSecret = this.configService.get<string>('WHATSAPP_APP_SECRET');
    if (!appSecret) {
      return false;
    }

    const body = JSON.stringify(request.body);
    const expectedSignature = `sha256=${createHmac('sha256', appSecret)
      .update(body, 'utf8')
      .digest('hex')}`;

    return signature === expectedSignature;
  }
}
