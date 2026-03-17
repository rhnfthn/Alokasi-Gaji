import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable graceful shutdown only in non-serverless environments
  const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME;
  if (!isServerless) {
    app.enableShutdownHooks();
  }

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      forbidNonWhitelisted: true,
    }),
  );

  const origin = process.env.CORS_ORIGIN;
  app.enableCors({
    origin: origin ? origin.split(',').map((o) => o.trim()) : true,
    credentials: true,
  });

  await app.listen(Number(process.env.PORT ?? 3001));
}
void bootstrap();
