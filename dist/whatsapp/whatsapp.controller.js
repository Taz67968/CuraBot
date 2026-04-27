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
var WhatsappController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsappController = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const whatsapp_service_1 = require("./whatsapp.service");
const whatsapp_guard_1 = require("./whatsapp.guard");
let WhatsappController = WhatsappController_1 = class WhatsappController {
    constructor(configService, whatsappService) {
        this.configService = configService;
        this.whatsappService = whatsappService;
        this.logger = new common_1.Logger(WhatsappController_1.name);
    }
    verifyWebhook(mode, challenge, verifyToken) {
        const expectedToken = this.configService.get('WHATSAPP_WEBHOOK_VERIFY_TOKEN');
        if (mode === 'subscribe' && verifyToken === expectedToken) {
            this.logger.log('Webhook verified successfully');
            return challenge;
        }
        throw new Error('Webhook verification failed');
    }
    async receiveMessage(payload) {
        this.logger.log('Received WhatsApp webhook payload', payload);
        const entries = payload.entry || [];
        for (const entry of entries) {
            const changes = entry.changes || [];
            for (const change of changes) {
                if (change.field === 'messages') {
                    const messages = change.value.messages || [];
                    for (const message of messages) {
                        await this.processMessage(message, change.value);
                    }
                }
            }
        }
    }
    async processMessage(message, _value) {
        const phoneNumber = message.from;
        const messageType = message.type;
        this.logger.log(`Processing message from ${phoneNumber}, type: ${messageType}`);
        if (messageType === 'text') {
            const text = message.text.body;
            await this.whatsappService.sendTextMessage(phoneNumber, `Hello! You said: "${text}". This is CuraBot responding.`);
        }
    }
};
exports.WhatsappController = WhatsappController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('hub.mode')),
    __param(1, (0, common_1.Query)('hub.challenge')),
    __param(2, (0, common_1.Query)('hub.verify_token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", String)
], WhatsappController.prototype, "verifyWebhook", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(whatsapp_guard_1.WhatsappGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WhatsappController.prototype, "receiveMessage", null);
exports.WhatsappController = WhatsappController = WhatsappController_1 = __decorate([
    (0, common_1.Controller)('webhook'),
    __metadata("design:paramtypes", [config_1.ConfigService,
        whatsapp_service_1.WhatsappService])
], WhatsappController);
//# sourceMappingURL=whatsapp.controller.js.map