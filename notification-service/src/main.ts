import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { Transport } from '@nestjs/microservices';
import axios from 'axios';
import { Logger } from '@nestjs/common';

dotenv.config();

const logger = new Logger('Main');

async function registerService(
  serviceName: string,
  version: string,
  port: number,
) {
  try {
    const response = await axios.put(
      `http://localhost:3001/register/${serviceName}/${version}/${port}`,
    );
    if (response.status === 200) {
      logger.log('Service registered successfully');
    }
  } catch (error) {
    logger.error('Failed to register service', error.message);
    setTimeout(() => registerService(serviceName, version, port), 15000);
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
    await unregisterService(serviceName, serviceVersion, servicePort);
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

bootstrap();
