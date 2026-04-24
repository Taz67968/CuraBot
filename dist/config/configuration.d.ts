export declare const configuration: (() => {
    port: number;
    nodeEnv: string;
    jwt: {
        secret: string;
        expiresIn: string;
    };
    whatsapp: {
        phoneNumberId: string;
        accessToken: string;
        webhookVerifyToken: string;
        appSecret: string;
    };
    openai: {
        apiKey: string;
        model: string;
    };
    redis: {
        enabled: boolean;
        url: string;
    };
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    port: number;
    nodeEnv: string;
    jwt: {
        secret: string;
        expiresIn: string;
    };
    whatsapp: {
        phoneNumberId: string;
        accessToken: string;
        webhookVerifyToken: string;
        appSecret: string;
    };
    openai: {
        apiKey: string;
        model: string;
    };
    redis: {
        enabled: boolean;
        url: string;
    };
}>;
