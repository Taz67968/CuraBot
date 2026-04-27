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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookMessage = exports.WebhookValue = exports.WebhookChange = exports.WebhookEntry = exports.WhatsAppWebhookDto = void 0;
const class_validator_1 = require("class-validator");
class WhatsAppWebhookDto {
}
exports.WhatsAppWebhookDto = WhatsAppWebhookDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], WhatsAppWebhookDto.prototype, "object", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], WhatsAppWebhookDto.prototype, "entry", void 0);
class WebhookEntry {
}
exports.WebhookEntry = WebhookEntry;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], WebhookEntry.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], WebhookEntry.prototype, "changes", void 0);
class WebhookChange {
}
exports.WebhookChange = WebhookChange;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], WebhookChange.prototype, "field", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", WebhookValue)
], WebhookChange.prototype, "value", void 0);
class WebhookValue {
}
exports.WebhookValue = WebhookValue;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], WebhookValue.prototype, "messaging_product", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], WebhookValue.prototype, "messages", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], WebhookValue.prototype, "contacts", void 0);
class WebhookMessage {
}
exports.WebhookMessage = WebhookMessage;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], WebhookMessage.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], WebhookMessage.prototype, "from", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], WebhookMessage.prototype, "timestamp", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], WebhookMessage.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], WebhookMessage.prototype, "text", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], WebhookMessage.prototype, "button", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], WebhookMessage.prototype, "interactive", void 0);
//# sourceMappingURL=webhook.dto.js.map