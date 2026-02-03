import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Vercel/Heroku proxy support (Critical for Secure Cookies)
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.set('trust proxy', 1);

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.setGlobalPrefix('api/v1');
  app.enableCors({
    origin: true, // In production, replace with frontend domain
    credentials: true, // Required for cookies
  });

  const config = new DocumentBuilder()
    .setTitle('247 GBS Audit API')
    .setDescription('API documentation for the 247 GBS Audit platform. \n\n**Authentication:** \n- Most endpoints require a Bearer Access Token.\n- Use `/auth/signin` to get tokens.\n- Use `/auth/refresh` with a Refresh Token to get new Access Tokens.')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'access-token')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'refresh-token')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
