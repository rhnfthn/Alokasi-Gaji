import type { IncomingMessage, ServerResponse } from "http";
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { ExpressAdapter } from "@nestjs/platform-express";
import express from "express";
import { AppModule } from "../src/app.module";

let cachedHandler: ((req: IncomingMessage, res: ServerResponse) => void) | null = null;

async function getHandler() {
  if (cachedHandler) return cachedHandler;

  const expressApp = express();

  const nestApp = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
    {
      // Keep logs minimal in serverless; adjust if debugging.
      logger: ["error", "warn"],
    },
  );

  nestApp.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      forbidNonWhitelisted: true,
    }),
  );

  const origin = process.env.CORS_ORIGIN;
  nestApp.enableCors({
    origin: origin ? origin.split(",").map((o) => o.trim()) : true,
    credentials: true,
  });

  await nestApp.init();

  cachedHandler = expressApp;
  return cachedHandler;
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const fn = await getHandler();
  return fn(req, res);
}
