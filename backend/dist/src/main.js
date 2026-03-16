"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
    }));
    const origin = process.env.CORS_ORIGIN;
    app.enableCors({
        origin: origin ? origin.split(',').map((o) => o.trim()) : true,
        credentials: true,
    });
    await app.listen(Number(process.env.PORT ?? 3001));
}
void bootstrap();
//# sourceMappingURL=main.js.map