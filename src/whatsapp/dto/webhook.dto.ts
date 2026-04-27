import { IsString, IsOptional, IsArray, IsObject } from 'class-validator';

export class WhatsAppWebhookDto {
  @IsString()
  object: string;

  @IsArray()
  entry: WebhookEntry[];
}

export class WebhookEntry {
  @IsString()
  id: string;

  @IsArray()
  changes: WebhookChange[];
}

export class WebhookChange {
  @IsString()
  field: string;

  @IsObject()
  value: WebhookValue;
}

export class WebhookValue {
  @IsString()
  messaging_product: string;

  @IsArray()
  @IsOptional()
  messages?: WebhookMessage[];

  @IsArray()
  @IsOptional()
  contacts?: any[];
}

export class WebhookMessage {
  @IsString()
  id: string;

  @IsString()
  from: string;

  @IsString()
  timestamp: string;

  @IsString()
  type: 'text' | 'button' | 'interactive';

  @IsObject()
  @IsOptional()
  text?: { body: string };

  @IsObject()
  @IsOptional()
  button?: { text: string; payload: string };

  @IsObject()
  @IsOptional()
  interactive?: any;
}
