"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const platform_fastify_1 = require("@nestjs/platform-fastify");
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_fastify_1.FastifyAdapter());
    const cors = require('@fastify/cors');
    await app.register(cors, {
        origin: true,
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.setGlobalPrefix('api');
    const fastifyInstance = app.getHttpAdapter().getInstance();
    fastifyInstance.get('/', (request, reply) => {
        reply.status(200).send({ status: 'ok', message: 'CuraBot API is running' });
    });
    fastifyInstance.head('/', (request, reply) => {
        reply.status(200).send();
    });
    const port = process.env.PORT || 3000;
    await app.listen(port, '0.0.0.0');
    common_2.Logger.log(`🚀 CuraBot is running on: http://localhost:${port}/api`, 'Bootstrap');
}
bootstrap();
//# sourceMappingURL=main.js.map