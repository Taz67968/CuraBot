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
var WhatsappService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsappService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = __importDefault(require("axios"));
let WhatsappService = WhatsappService_1 = class WhatsappService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(WhatsappService_1.name);
        this.httpClient = axios_1.default.create({
            baseURL: `https://graph.facebook.com/v18.0/${this.configService.get('WHATSAPP_PHONE_NUMBER_ID')}/messages`,
            headers: {
                Authorization: `Bearer ${this.configService.get('WHATSAPP_ACCESS_TOKEN')}`,
                'Content-Type': 'application/json',
            },
        });
    }
    async sendMessage(message) {
        try {
            const payload = {
                messaging_product: 'whatsapp',
                to: message.to,
                type: message.type || 'text',
            };
            if (message.type === 'interactive' && message.buttons) {
                payload.interactive = {
                    type: 'button',
                    body: { text: message.text },
                    action: {
                        buttons: message.buttons.map((btn) => ({
                            type: 'reply',
                            reply: { id: btn.id, title: btn.title },
                        })),
                    },
                };
            }
            else {
                payload.text = { body: message.text };
            }
            await this.httpClient.post('', payload);
            this.logger.log(`Message sent to ${message.to}`);
        }
        catch (error) {
            this.logger.error(`Failed to send message to ${message.to}`, error);
            throw error;
        }
    }
    async sendTextMessage(to, text) {
        await this.sendMessage({ to, text });
    }
};
exports.WhatsappService = WhatsappService;
exports.WhatsappService = WhatsappService = WhatsappService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], WhatsappService);
//# sourceMappingURL=whatsapp.service.js.map