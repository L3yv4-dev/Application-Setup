"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
const nest_winston_1 = require("nest-winston");
const winston_config_1 = require("./common/logger/winston.config");
const common_1 = require("@nestjs/common");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const logging_interceptor_1 = require("./common/interceptors/logging.interceptor");
const config_1 = require("@nestjs/config");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: nest_winston_1.WinstonModule.createLogger(winston_config_1.winstonConfig),
    });
    // Obtener ConfigService
    const configService = app.get(config_1.ConfigService);
    // Usar puerto de .env o 3000 por defecto
    const port = configService.get('PORT') || 3000;
    // Swagger
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Application Setup API')
        .setDescription('API documentation for Application Setup')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    // Global pipes, filters and interceptors
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    app.useGlobalInterceptors(new logging_interceptor_1.RequestIdInterceptor());
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    await app.listen(port);
    console.log(`Application is running on port ${port}`);
}
bootstrap().catch((err) => {
    console.error('Failed to start application:', err);
    process.exit(1);
});
