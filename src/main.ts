import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

  // CORS
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const cors = require('@fastify/cors');
  await app.register(cors, {
    origin: true,
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global prefix for API routes
  app.setGlobalPrefix('api');

  // Root health check endpoint (for Render.com health checks)
  const fastifyInstance = app.getHttpAdapter().getInstance();
  fastifyInstance.get('/', (request, reply) => {
    reply.status(200).send({ status: 'ok', message: 'CuraBot API is running' });
  });
  fastifyInstance.head('/', (request, reply) => {
    reply.status(200).send();
  });

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');

  Logger.log(`🚀 CuraBot is running on: http://localhost:${port}/api`, 'Bootstrap');
}

bootstrap();
