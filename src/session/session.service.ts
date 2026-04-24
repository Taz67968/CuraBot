import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';

export interface SessionData {
  patientId?: string;
  currentFlow: string;
  pendingData: Record<string, any>;
  messageHistory: Array<{ role: 'user' | 'assistant'; content: string }>;
  language: 'en' | 'fr';
  lastActivity: string;
}

@Injectable()
export class SessionService {
  private readonly logger = new Logger(SessionService.name);
  private readonly redis: Redis;

  constructor(private readonly redisService: RedisService) {
    this.redis = this.redisService.getClient();
  }

  /**
   * Get session data for a phone number
   */
  async getSession(phoneNumber: string): Promise<SessionData | null> {
    try {
      const key = `session:${phoneNumber}`;
      const data = await this.redis.get(key);

      if (!data) {
        return null;
      }

      return JSON.parse(data);
    } catch (error) {
      this.logger.error(`Failed to get session for ${phoneNumber}`, error);
      return null;
    }
  }

  /**
   * Set session data for a phone number with 30-minute TTL
   */
  async setSession(phoneNumber: string, sessionData: SessionData): Promise<void> {
    try {
      const key = `session:${phoneNumber}`;
      const ttl = 30 * 60; // 30 minutes in seconds

      await this.redis.setex(key, ttl, JSON.stringify(sessionData));
      this.logger.log(`Session updated for ${phoneNumber}`);
    } catch (error) {
      this.logger.error(`Failed to set session for ${phoneNumber}`, error);
      throw error;
    }
  }

  /**
   * Update specific fields in session data
   */
  async updateSession(phoneNumber: string, updates: Partial<SessionData>): Promise<void> {
    const currentSession = await this.getSession(phoneNumber);
    if (!currentSession) {
      throw new Error(`No session found for phone number ${phoneNumber}`);
    }
    const updatedSession = { ...currentSession, ...updates };

    await this.setSession(phoneNumber, updatedSession);
  }

  /**
   * Add a message to the conversation history
   */
  async addMessageToHistory(
    phoneNumber: string,
    role: 'user' | 'assistant',
    content: string,
  ): Promise<void> {
    const session = await this.getSession(phoneNumber);
    if (!session) {
      // Create new session if doesn't exist
      const newSession: SessionData = {
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

    // Keep only last 50 messages to prevent memory issues
    if (session.messageHistory.length > 50) {
      session.messageHistory = session.messageHistory.slice(-50);
    }

    await this.setSession(phoneNumber, session);
  }

  /**
   * Clear session data
   */
  async clearSession(phoneNumber: string): Promise<void> {
    try {
      const key = `session:${phoneNumber}`;
      await this.redis.del(key);
      this.logger.log(`Session cleared for ${phoneNumber}`);
    } catch (error) {
      this.logger.error(`Failed to clear session for ${phoneNumber}`, error);
      throw error;
    }
  }
}
