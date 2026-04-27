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
var SessionService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionService = void 0;
const common_1 = require("@nestjs/common");
const nestjs_redis_1 = require("@liaoliaots/nestjs-redis");
let SessionService = SessionService_1 = class SessionService {
    constructor(redisService) {
        this.redisService = redisService;
        this.logger = new common_1.Logger(SessionService_1.name);
        this.redis = this.redisService.getClient();
    }
    async getSession(phoneNumber) {
        try {
            const key = `session:${phoneNumber}`;
            const data = await this.redis.get(key);
            if (!data) {
                return null;
            }
            return JSON.parse(data);
        }
        catch (error) {
            this.logger.error(`Failed to get session for ${phoneNumber}`, error);
            return null;
        }
    }
    async setSession(phoneNumber, sessionData) {
        try {
            const key = `session:${phoneNumber}`;
            const ttl = 30 * 60;
            await this.redis.setex(key, ttl, JSON.stringify(sessionData));
            this.logger.log(`Session updated for ${phoneNumber}`);
        }
        catch (error) {
            this.logger.error(`Failed to set session for ${phoneNumber}`, error);
            throw error;
        }
    }
    async updateSession(phoneNumber, updates) {
        const currentSession = await this.getSession(phoneNumber);
        if (!currentSession) {
            throw new Error(`No session found for phone number ${phoneNumber}`);
        }
        const updatedSession = { ...currentSession, ...updates };
        await this.setSession(phoneNumber, updatedSession);
    }
    async addMessageToHistory(phoneNumber, role, content) {
        const session = await this.getSession(phoneNumber);
        if (!session) {
            const newSession = {
                currentFlow: 'initial',
                pendingData: {},
                messageHistory: [{ role, content }],
                language: 'en',
                lastActivity: new Date().toISOString(),
            };
            await this.setSession(phoneNumber, newSession);
            return;
        }
        session.messageHistory.push({ role, content });
        session.lastActivity = new Date().toISOString();
        if (session.messageHistory.length > 50) {
            session.messageHistory = session.messageHistory.slice(-50);
        }
        await this.setSession(phoneNumber, session);
    }
    async clearSession(phoneNumber) {
        try {
            const key = `session:${phoneNumber}`;
            await this.redis.del(key);
            this.logger.log(`Session cleared for ${phoneNumber}`);
        }
        catch (error) {
            this.logger.error(`Failed to clear session for ${phoneNumber}`, error);
            throw error;
        }
    }
};
exports.SessionService = SessionService;
exports.SessionService = SessionService = SessionService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [nestjs_redis_1.RedisService])
], SessionService);
//# sourceMappingURL=session.service.js.map