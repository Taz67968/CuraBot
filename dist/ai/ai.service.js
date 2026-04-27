"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var AiService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const openai_1 = __importDefault(require("openai"));
const prompts_service_1 = require("./prompts/prompts.service");
let AiService = AiService_1 = class AiService {
    constructor(configService, promptsService) {
        this.configService = configService;
        this.promptsService = promptsService;
        this.logger = new common_1.Logger(AiService_1.name);
        this.openai = new openai_1.default({
            apiKey: this.configService.get('OPENAI_API_KEY'),
        });
    }
    async classifyIntent(message, conversationHistory) {
        try {
            const systemPrompt = this.promptsService.getIntentClassificationPrompt();
            const messages = [
                {
                    role: 'user',
                    content: `User message: "${message}"

Conversation history:
${conversationHistory.map((h) => `${h.role}: ${h.content}`).join('\n')}

Please classify the intent and extract entities.`,
                },
            ];
            const response = await this.openai.chat.completions.create({
                model: this.configService.get('OPENAI_MODEL') || 'gpt-4o-mini',
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
                const result = JSON.parse(content);
                this.logger.log(`Intent classified: ${result.intent} (${result.confidence})`);
                return result;
            }
            throw new Error('Invalid response format from OpenAI');
        }
        catch (error) {
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
    async triageSymptoms(symptoms) {
        try {
            const prompt = this.promptsService.getSymptomTriagePrompt(symptoms);
            const response = await this.openai.chat.completions.create({
                model: this.configService.get('OPENAI_MODEL') || 'gpt-4o-mini',
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
                return JSON.parse(content);
            }
            throw new Error('Invalid response format from OpenAI');
        }
        catch (error) {
            this.logger.error('Failed to triage symptoms', error);
            return {
                severity: 'MEDIUM',
                recommendation: 'Please consult a healthcare professional.',
                emergency: false,
                followUp: 'Contact your doctor if symptoms worsen.',
            };
        }
    }
    async generateResponse(context) {
        try {
            const prompt = this.promptsService.getConversationPrompt(context);
            const response = await this.openai.chat.completions.create({
                model: this.configService.get('OPENAI_MODEL') || 'gpt-4o-mini',
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
        }
        catch (error) {
            this.logger.error('Failed to generate response', error);
            return 'I apologize, but I encountered an error. Please try again.';
        }
    }
};
exports.AiService = AiService;
exports.AiService = AiService = AiService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prompts_service_1.PromptsService])
], AiService);
//# sourceMappingURL=ai.service.js.map