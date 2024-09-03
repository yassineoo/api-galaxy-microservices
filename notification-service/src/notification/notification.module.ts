import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import {PrismaService} from "../utils/prisma"
// import kafka module 
import { KafkaService } from "../kafka/kafka.service"
@Module({
  controllers: [NotificationController],
  providers: [NotificationService,PrismaService,KafkaService],
})
export class NotificationModule {}
