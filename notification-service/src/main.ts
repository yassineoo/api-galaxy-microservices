import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.GRPC,
    options: {
      url: 'localhost:5000', // Replace with the appropriate host and port
      package: 'hello',
      protoPath: './src/hello.proto', // Path to your .proto file
    },
  });

  app.listen();
}
bootstrap();
