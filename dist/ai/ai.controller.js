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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AiController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiController = void 0;
const common_1 = require("@nestjs/common");
const ai_service_1 = require("./ai.service");
let AiController = AiController_1 = class AiController {
    constructor(aiService) {
        this.aiService = aiService;
        this.logger = new common_1.Logger(AiController_1.name);
    }
    health() {
        return {
            status: 'ok',
            service: 'Claude AI',
            timestamp: new Date().toISOString(),
        };
    }
    async classifyIntent(body) {
        this.logger.log(`Classifying intent for: ${body.message}`);
        return this.aiService.classifyIntent(body.message, body.history || []);
    }
    async triageSymptoms(body) {
        this.logger.log(`Triaging symptoms: ${body.symptoms.join(', ')}`);
        return this.aiService.triageSymptoms(body.symptoms);
    }
    async generateResponse(body) {
        this.logger.log(`Generating response for: ${body.userMessage}`);
        const response = await this.aiService.generateResponse({
            userMessage: body.userMessage,
            context: body.context,
            conversationHistory: body.conversationHistory,
        });
        return { response };
    }
    async chat(body) {
        this.logger.log(`Processing chat message: ${body.message}`);
        const intent = await this.aiService.classifyIntent(body.message, body.conversationHistory || []);
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
        }
        else {
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
};
exports.AiController = AiController;
__decorate([
    (0, common_1.Get)('health'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AiController.prototype, "health", null);
__decorate([
    (0, common_1.Post)('classify-intent'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "classifyIntent", null);
__decorate([
    (0, common_1.Post)('triage-symptoms'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "triageSymptoms", null);
__decorate([
    (0, common_1.Post)('generate-response'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "generateResponse", null);
__decorate([
    (0, common_1.Post)('chat'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "chat", null);
exports.AiController = AiController = AiController_1 = __decorate([
    (0, common_1.Controller)('ai'),
    __metadata("design:paramtypes", [ai_service_1.AiService])
], AiController);
//# sourceMappingURL=ai.controller.js.map