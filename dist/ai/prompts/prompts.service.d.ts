export declare class PromptsService {
    getIntentClassificationPrompt(): string;
    getSymptomTriagePrompt(symptoms: string[]): string;
    getConversationPrompt(context: any): string;
}
