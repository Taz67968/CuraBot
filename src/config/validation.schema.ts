import * as Joi from 'joi';

export const validationSchema = Joi.object({
  // Application
  PORT: Joi.number().default(3000),
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),

  // Database
  DATABASE_URL: Joi.string().required(),

  // Redis
  REDIS_URL: Joi.string().default('redis://localhost:6379'),

  // JWT
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().default('7d'),

  // WhatsApp
  WHATSAPP_PHONE_NUMBER_ID: Joi.string().required(),
  WHATSAPP_ACCESS_TOKEN: Joi.string().required(),
  WHATSAPP_WEBHOOK_VERIFY_TOKEN: Joi.string().required(),
  WHATSAPP_APP_SECRET: Joi.string().required(),

  // OpenAI
  OPENAI_API_KEY: Joi.string().required(),
  OPENAI_MODEL: Joi.string().default('gpt-4o-mini'),
});
