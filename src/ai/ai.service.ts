import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { PromptsService } from './prompts/prompts.service';

export interface IntentResult {
  intent:
    | 'BOOK_APPOINTMENT'
    | 'CANCEL_APPOINTMENT'
    | 'RESCHEDULE'
    | 'SYMPTOM_CHECK'
    | 'STATUS_CHECK'
    | 'HUMAN_HANDOFF'
    | 'UNKNOWN';
  confidence: number;
  entities: {
    date?: string;
    time?: string;
    specialty?: string;
    symptoms?: string[];
  };
  language: 'en' | 'fr';
  nextStep: string;
}

export interface TriageResult {
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  recommendation: string;
  emergency: boolean;
  followUp: string;
}

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly openai: OpenAI;

  constructor(
    private configService: ConfigService,
    private promptsService: PromptsService,
  ) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  /**
   * Classify user intent from message and conversation history
   */
  async classifyIntent(
    message: string,
    conversationHistory: Array<{ role: string; content: string }>,
  ): Promise<IntentResult> {
    try {
      const systemPrompt = this.promptsService.getIntentClassificationPrompt();

      const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
        {
          role: 'user',
          content: `User message: "${message}"

Conversation history:
${conversationHistory.map((h) => `${h.role}: ${h.content}`).join('\n')}

Please classify the intent and extract entities.`,
        },
      ];

      const response = await this.openai.chat.completions.create({
        model: this.configService.get<string>('OPENAI_MODEL') || 'gpt-4o-mini',
        max_tokens: 1000,
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          ...messages,
        ],
      });

      const content = response.choices[0]?.message?.content;
      if (content) {
        const result = JSON.parse(content) as IntentResult;
        this.logger.log(`Intent classified: ${result.intent} (${result.confidence})`);
        return result;
      }

      throw new Error('Invalid response format from OpenAI');
    } catch (error) {
      this.logger.error('Failed to classify intent', error);
      return {
        intent: 'UNKNOWN',
        confidence: 0,
        entities: {},
        language: 'en',
        nextStep: 'Please try rephrasing your request.',
      };
    }
  }

  /**
   * Perform symptom triage
   */
  async triageSymptoms(symptoms: string[]): Promise<TriageResult> {
    try {
      const prompt = this.promptsService.getSymptomTriagePrompt(symptoms);

      const response = await this.openai.chat.completions.create({
        model: this.configService.get<string>('OPENAI_MODEL') || 'gpt-4o-mini',
        max_tokens: 500,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const content = response.choices[0]?.message?.content;
      if (content) {
        return JSON.parse(content) as TriageResult;
      }

      throw new Error('Invalid response format from OpenAI');
    } catch (error) {
      this.logger.error('Failed to triage symptoms', error);
      return {
        severity: 'MEDIUM',
        recommendation: 'Please consult a healthcare professional.',
        emergency: false,
        followUp: 'Contact your doctor if symptoms worsen.',
      };
    }
  }

  /**
   * Generate conversational response
   */
  async generateResponse(context: any): Promise<string> {
    try {
      const prompt = this.promptsService.getConversationPrompt(context);

      const response = await this.openai.chat.completions.create({
        model: this.configService.get<string>('OPENAI_MODEL') || 'gpt-4o-mini',
        max_tokens: 300,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const content = response.choices[0]?.message?.content;
      if (content) {
        return content.trim();
      }

      throw new Error('Invalid response format from OpenAI');
    } catch (error) {
      this.logger.error('Failed to generate response', error);
      return 'I apologize, but I encountered an error. Please try again.';
    }
  }
}
