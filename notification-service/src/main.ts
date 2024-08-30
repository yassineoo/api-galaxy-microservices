import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { Transport } from '@nestjs/microservices';
import axios from 'axios';
import { Logger,ValidationPipe } from '@nestjs/common';

dotenv.config();

const logger = new Logger('Main');

async function registerService(serviceName: string, serviceVersion: string, servicePort: number) {
  try {
    await axios.put(`http://service-registry:3001/register/${serviceName}/${serviceVersion}/${servicePort}`);
    console.log(`Successfully registered ${serviceName} with version ${serviceVersion} on port ${servicePort}`);
  } catch (error) {
    console.error(`Failed to register service ${serviceName}:`, error.message || error);
  }
}

async function unregisterService(
  serviceName: string,
  version: string,
  port: number,
) {
  try {
    const response = await axios.delete(
      `http://localhost:3001/register/${serviceName}/${version}/${port}`,
    );
    if (response.status === 200) {
      logger.log('Service unregistered successfully');
    }
  } catch (error) {
    logger.error('Failed to unregister service', error.message);
  }
}



async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.GRPC,
    options: {
      url: 'localhost:8088',
      package: 'sms',
      protoPath: './src/proto/sms.proto',
    },
  });

  const serviceName = 'notification-service';
  const serviceVersion = 'v1';
  const servicePort = 8088;

  await app.listen();

  logger.log(`Microservice is listening on port ${servicePort}`);
  registerService(serviceName, serviceVersion, servicePort);

  // Graceful shutdown
  const shutdown = async () => {
    try {
      await unregisterService(serviceName, serviceVersion, servicePort);
    } catch (error) {
      logger.error(`Failed to unregister service: ${error.message}`);
    } finally {
      process.exit(0);
    }
  };
  
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

bootstrap();




/*async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS if you plan to allow cross-origin requests
  app.enableCors();

  // Use global pipes for validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Strip out properties that are not in the DTOs
    forbidNonWhitelisted: true, // Throw an error if non-whitelisted properties are found
    transform: true, // Automatically transform payloads to be objects typed according to their DTO classes
  }));

  // Start the application and listen on a specific port
  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();


*/