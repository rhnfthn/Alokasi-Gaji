"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const express_1 = __importDefault(require("express"));
const app_module_1 = require("../src/app.module");
let cachedHandler = null;
async function getHandler() {
    if (cachedHandler)
        return cachedHandler;
    const expressApp = (0, express_1.default)();
    const nestApp = await core_1.NestFactory.create(app_module_1.AppModule, new platform_express_1.ExpressAdapter(expressApp), {
        logger: ["error", "warn"],
    });
    nestApp.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
    }));
    const origin = process.env.CORS_ORIGIN;
    nestApp.enableCors({
        origin: origin ? origin.split(",").map((o) => o.trim()) : true,
        credentials: true,
    });
    await nestApp.init();
    cachedHandler = expressApp;
    return cachedHandler;
}
async function handler(req, res) {
    const fn = await getHandler();
    return fn(req, res);
}
//# sourceMappingURL=index.js.map