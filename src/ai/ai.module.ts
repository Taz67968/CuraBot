import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { PromptsService } from './prompts/prompts.service';
import { AiController } from './ai.controller';

@Module({
  controllers: [AiController],
  providers: [AiService, PromptsService],
  exports: [AiService],
})
export class AiModule {}
