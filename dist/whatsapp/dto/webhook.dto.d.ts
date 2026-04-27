export declare class WhatsAppWebhookDto {
    object: string;
    entry: WebhookEntry[];
}
export declare class WebhookEntry {
    id: string;
    changes: WebhookChange[];
}
export declare class WebhookChange {
    field: string;
    value: WebhookValue;
}
export declare class WebhookValue {
    messaging_product: string;
    messages?: WebhookMessage[];
    contacts?: any[];
}
export declare class WebhookMessage {
    id: string;
    from: string;
    timestamp: string;
    type: 'text' | 'button' | 'interactive';
    text?: {
        body: string;
    };
    button?: {
        text: string;
        payload: string;
    };
    interactive?: any;
}
