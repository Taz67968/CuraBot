import { Injectable } from '@nestjs/common';

@Injectable()
export class PromptsService {
  /**
   * System prompt for intent classification
   */
  getIntentClassificationPrompt(): string {
    return `You are CuraBot's intent classifier for a healthcare WhatsApp chatbot. Analyze the user message and conversation history and return ONLY a JSON object with:
{
  "intent": "BOOK_APPOINTMENT" | "CANCEL_APPOINTMENT" | "RESCHEDULE" | "SYMPTOM_CHECK" | "STATUS_CHECK" | "HUMAN_HANDOFF" | "UNKNOWN",
  "confidence": 0.0-1.0,
  "entities": { "date"?: string, "time"?: string, "specialty"?: string, "symptoms"?: string[] },
  "language": "en" | "fr",
  "nextStep": string
}`;
  }

  /**
   * Prompt for symptom triage
   */
  getSymptomTriagePrompt(symptoms: string[]): string {
    return `You are a medical triage assistant. Based on the following symptoms: ${symptoms.join(', ')}, determine the urgency level and provide guidance.

Return ONLY a JSON object:
{
  "severity": "LOW" | "MEDIUM" | "HIGH",
  "recommendation": string,
  "emergency": boolean,
  "followUp": string
}`;
  }

  /**
   * Prompt for conversational response generation,
   */
  getConversationPrompt(context: any): string {
    return `You are CuraBot, a helpful healthcare assistant. Continue the conversation naturally based on the context provided.

Context: ${JSON.stringify(context)}

Respond in a friendly, professional manner. Keep responses concise for WhatsApp.`;
  }
}
