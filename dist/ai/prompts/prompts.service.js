"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromptsService = void 0;
const common_1 = require("@nestjs/common");
let PromptsService = class PromptsService {
    getIntentClassificationPrompt() {
        return `You are CuraBot's intent classifier for a healthcare WhatsApp chatbot. Analyze the user message and conversation history and return ONLY a JSON object with:
{
  "intent": "BOOK_APPOINTMENT" | "CANCEL_APPOINTMENT" | "RESCHEDULE" | "SYMPTOM_CHECK" | "STATUS_CHECK" | "HUMAN_HANDOFF" | "UNKNOWN",
  "confidence": 0.0-1.0,
  "entities": { "date"?: string, "time"?: string, "specialty"?: string, "symptoms"?: string[] },
  "language": "en" | "fr",
  "nextStep": string
}`;
    }
    getSymptomTriagePrompt(symptoms) {
        return `You are a medical triage assistant. Based on the following symptoms: ${symptoms.join(', ')}, determine the urgency level and provide guidance.

Return ONLY a JSON object:
{
  "severity": "LOW" | "MEDIUM" | "HIGH",
  "recommendation": string,
  "emergency": boolean,
  "followUp": string
}`;
    }
    getConversationPrompt(context) {
        return `You are CuraBot, a helpful healthcare assistant. Continue the conversation naturally based on the context provided.

Context: ${JSON.stringify(context)}

Respond in a friendly, professional manner. Keep responses concise for WhatsApp.`;
    }
};
exports.PromptsService = PromptsService;
exports.PromptsService = PromptsService = __decorate([
    (0, common_1.Injectable)()
], PromptsService);
//# sourceMappingURL=prompts.service.js.map