import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { DataSource } from 'typeorm';
import { seedUsers } from './database/seeders';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const cors = ['https://localhost:3000', '*'];
  console.log('api cors ------------------>', cors);
  app.enableCors({
    credentials: true,
    allowedHeaders: [
      'DNT',
      'Access-Control-Allow-Headers',
      'Origin',
      'Accept',
      'User-Agent',
      'Access-Control-Request-Method',
      ' Access-Control-Request-Headers',
      'X-Requested-With',
      'If-Modified-Since',
      'Cache-Control',
      'Content-Type',
      'Authorization',
      'access-control-allow-origin', // Add this header to the allowed headers
    ],
    origin: cors,
    methods: ['POST', 'GET', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  app.setGlobalPrefix('api');
  app.use(cookieParser());
  //app.use(rawBodyMiddleware());
  const swaggerConfig = new DocumentBuilder()
    .setTitle('CriLoto Api')
    .setDescription('The backend for CriLoto app and dashboard')
    .addTag('CriLoto Api')
    .setVersion('v1')
    .addBearerAuth()
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, swaggerDocument);

  const datasource = app.get(DataSource);

  await app.listen(3000);
  await seedUsers(datasource, app);
}
bootstrap();
