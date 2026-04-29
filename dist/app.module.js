"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const typeorm_1 = require("@nestjs/typeorm");
const bullmq_1 = require("@nestjs/bullmq");
const whatsapp_module_1 = require("./whatsapp/whatsapp.module");
const ai_module_1 = require("./ai/ai.module");
const session_module_1 = require("./session/session.module");
const appointments_module_1 = require("./appointments/appointments.module");
const patients_module_1 = require("./patients/patients.module");
const doctors_module_1 = require("./doctors/doctors.module");
const reminders_module_1 = require("./reminders/reminders.module");
const auth_module_1 = require("./auth/auth.module");
const common_module_1 = require("./common/common.module");
const validation_schema_1 = require("./config/validation.schema");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                validationSchema: validation_schema_1.validationSchema,
                envFilePath: ['.env.local', '.env'],
            }),
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: 60000,
                    limit: 10,
                },
            ]),
            typeorm_1.TypeOrmModule.forRootAsync({
                useFactory: () => {
                    const dbUrl = process.env.DATABASE_URL || '';
                    const isSqlite = dbUrl.startsWith('sqlite:');
                    return {
                        type: isSqlite ? 'sqlite' : 'postgres',
                        url: dbUrl,
                        database: isSqlite ? dbUrl.replace('sqlite:', '') : undefined,
                        autoLoadEntities: true,
                        synchronize: process.env.NODE_ENV !== 'production',
                        logging: false,
                    };
                },
            }),
            ...(process.env.REDIS_ENABLED !== 'false'
                ? [
                    bullmq_1.BullModule.forRoot({
                        connection: {
                            host: process.env.REDIS_HOST || 'localhost',
                            port: parseInt(process.env.REDIS_PORT || '6379', 10),
                        },
                    }),
                ]
                : []),
            common_module_1.CommonModule,
            whatsapp_module_1.WhatsappModule,
            ai_module_1.AiModule,
            session_module_1.SessionModule,
            patients_module_1.PatientsModule,
            doctors_module_1.DoctorsModule,
            appointments_module_1.AppointmentsModule,
            reminders_module_1.RemindersModule,
            auth_module_1.AuthModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map