import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { GrpcMethod } from '@nestjs/microservices';
//import { HelloRequest, HelloResponse } from 'src/proto/hello';
import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';

@Injectable()
export class NotificationService {
  //@GrpcMethod('NotificationService', 'SendNotification')
  sendNotification(request: any): any {
    // Implement your notification logic here
    return { message: `Notification sent to ${request.userId}` };
  }

  create(createNotificationDto: CreateNotificationDto) {
    return 'This action adds a new notification';
  }

  findAll() {
    return `This action returns all notification`;
  }

  findOne(id: number) {
    return `This action returns a #${id} notification`;
  }

  update(id: number, updateNotificationDto: UpdateNotificationDto) {
    return `This action updates a #${id} notification`;
  }

  remove(id: number) {
    return `This action removes a #${id} notification`;
  }
}
