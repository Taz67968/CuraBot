import { Module } from '@nestjs/common';
import { WhatsappController } from './whatsapp.controller';
import { WhatsappService } from './whatsapp.service';
import { WhatsappGuard } from './whatsapp.guard';

@Module({
  controllers: [WhatsappController],
  providers: [WhatsappService, WhatsappGuard],
  exports: [WhatsappService],
})
export class WhatsappModule {}
