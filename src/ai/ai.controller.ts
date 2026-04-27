import { Controller, Post, Body, Get, Logger } from '@nestjs/common';
import { AiService, IntentResult, TriageResult } from './ai.service';

@Controller('ai')
export class AiController {
  private readonly logger = new Logger(AiController.name);

  constructor(private aiService: AiService) {}

  /**
   * Test health endpoint
   * GET /api/ai/health
   */
  @Get('health')
  health() {
    return {
      status: 'ok',
      service: 'Claude AI',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Classify user intent from message
   * POST /api/ai/classify-intent
   * Body: { message: string, history?: Array<{role: string, content: string}> }
   */
  @Post('classify-intent')
  async classifyIntent(
    @Body() body: { message: string; history?: Array<{ role: string; content: string }> },
  ): Promise<IntentResult> {
    this.logger.log(`Classifying intent for: ${body.message}`);
    return this.aiService.classifyIntent(body.message, body.history || []);
  }

  /**
   * Perform symptom triage
   * POST /api/ai/triage-symptoms
   * Body: { symptoms: string[] }
   */
  @Post('triage-symptoms')
  async triageSymptoms(@Body() body: { symptoms: string[] }): Promise<TriageResult> {
    this.logger.log(`Triaging symptoms: ${body.symptoms.join(', ')}`);
    return this.aiService.triageSymptoms(body.symptoms);
  }

  /**
   * Generate conversational response
   * POST /api/ai/generate-response
   * Body: {
   *   userMessage: string,
   *   context?: {
   *     patientName?: string,
   *     patientHistory?: string,
   *     currentFlow?: string
   *   },
   *   conversationHistory?: Array<{role: string, content: string}>
   * }
   */
  @Post('generate-response')
  async generateResponse(
    @Body()
    body: {
      userMessage: string;
      context?: Record<string, any>;
      conversationHistory?: Array<{ role: string; content: string }>;
    },
  ): Promise<{ response: string }> {
    this.logger.log(`Generating response for: ${body.userMessage}`);
    const response = await this.aiService.generateResponse({
      userMessage: body.userMessage,
      context: body.context,
      conversationHistory: body.conversationHistory,
    });
    return { response };
  }

  /**
   * Complete conversation flow (intent -> response)
   * POST /api/ai/chat
   * Body: {
   *   message: string,
   *   conversationHistory?: Array<{role: string, content: string}>,
   *   patientContext?: Record<string, any>
   * }
   */
  @Post('chat')
  async chat(
    @Body()
    body: {
      message: string;
      conversationHistory?: Array<{ role: string; content: string }>;
      patientContext?: Record<string, any>;
    },
  ): Promise<{
    intent: IntentResult;
    response: string;
    confidence: number;
    nextAction: string;
  }> {
    this.logger.log(`Processing chat message: ${body.message}`);

    // Step 1: Classify intent
    const intent = await this.aiService.classifyIntent(
      body.message,
      body.conversationHistory || [],
    );

    // Step 2: Generate response based on intent
    let response = '';
    if (intent.confidence >= 0.7) {
      response = await this.aiService.generateResponse({
        userMessage: body.message,
        context: {
          ...body.patientContext,
          detectedIntent: intent.intent,
        },
        conversationHistory: body.conversationHistory,
      });
    } else {
      response =
        'I am not confident enough to handle this request. Please speak with a human agent.';
    }

    return {
      intent,
      response,
      confidence: intent.confidence,
      nextAction: intent.confidence >= 0.7 ? intent.nextStep : 'ESCALATE_TO_HUMAN',
    };
  }
}
