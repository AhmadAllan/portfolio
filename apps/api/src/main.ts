import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import { join } from 'path';
import { AppModule } from './app/app.module';
import {
  JSendInterceptor,
  HttpExceptionFilter,
  AllExceptionsFilter,
} from '@portfolio/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global prefix
  const globalPrefix = 'api/v1';
  app.setGlobalPrefix(globalPrefix);

  // Middleware
  app.use(cookieParser());

  // Serve static files from uploads directory
  app.use('/uploads', express.static(join(process.cwd(), 'uploads'), {
    maxAge: '1y',
    index: false,
  }));

  // CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:4200',
    credentials: true,
  });

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  // Global interceptors
  app.useGlobalInterceptors(new JSendInterceptor());

  // Global filters
  app.useGlobalFilters(new AllExceptionsFilter(), new HttpExceptionFilter());

  // Swagger/OpenAPI documentation
  const config = new DocumentBuilder()
    .setTitle('Lovecraftian Portfolio API')
    .setDescription('REST API for the Lovecraftian Portfolio Platform')
    .setVersion('1.0')
    .addTag('auth', 'Authentication endpoints')
    .addTag('blog', 'Blog management')
    .addTag('garden', 'Digital garden')
    .addTag('portfolio', 'Portfolio management')
    .addTag('media', 'Media library')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
  Logger.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
}

bootstrap();
