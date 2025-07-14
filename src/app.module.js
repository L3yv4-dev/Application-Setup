"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const Joi = __importStar(require("joi"));
const nest_winston_1 = require("nest-winston");
const winston = __importStar(require("winston"));
const typeorm_1 = require("@nestjs/typeorm");
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
const health_module_1 = require("./modules/health/health.module");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                validationSchema: Joi.object({
                    NODE_ENV: Joi.string()
                        .valid('development', 'production', 'test')
                        .default('development'),
                    PORT: Joi.number().default(3000),
                    DB_HOST: Joi.string().required(),
                    DB_PORT: Joi.number().default(5432),
                    DB_NAME: Joi.string().required(),
                    DB_USER: Joi.string().required(),
                    DB_PASSWORD: Joi.string().required(),
                }),
                envFilePath: '.env',
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    type: 'postgres',
                    host: config.get('DB_HOST'),
                    port: config.get('DB_PORT'),
                    username: config.get('DB_USER'),
                    password: config.get('DB_PASSWORD'),
                    database: config.get('DB_NAME'),
                    entities: [__dirname + '/**/*.entity{.ts,.js}'],
                    synchronize: true, // Solo para desarrollo
                    logging: true,
                    extra: {
                        max: 5,
                    },
                }),
            }),
            nest_winston_1.WinstonModule.forRoot({
                transports: [
                    new winston.transports.Console({
                        level: 'debug',
                        format: winston.format.combine(winston.format.timestamp(), winston.format.colorize(), winston.format.printf((info) => {
                            const context = typeof info.context === 'string' ? info.context : 'APP';
                            let requestId = '';
                            if (info.requestId) {
                                requestId =
                                    typeof info.requestId === 'string'
                                        ? ` (${info.requestId})`
                                        : ` (${JSON.stringify(info.requestId)})`;
                            }
                            const message = typeof info.message === 'string'
                                ? info.message
                                : typeof info.message === 'object' && info.message !== null
                                    ? JSON.stringify(info.message)
                                    : String(info.message);
                            return `[${info.timestamp}] ${info.level} [${context}]${requestId}: ${message}`;
                        })),
                    }),
                    new winston_daily_rotate_file_1.default({
                        level: 'info',
                        dirname: 'logs',
                        filename: 'application-%DATE%.log',
                        datePattern: 'YYYY-MM-DD',
                        zippedArchive: true,
                        maxSize: '20m',
                        maxFiles: '14d',
                        format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
                    }),
                ],
            }),
            health_module_1.HealthModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
