import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post("/create")
  async create(@Body() createNotificationDto: CreateNotificationDto) {
    return await this.notificationService.create(createNotificationDto);
  }

  @Get("/all/:userId")
  async findUserNotifications(@Param("userId") userId : string) {
    return await this.notificationService.getUserNotifications(+userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.notificationService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateNotificationDto: UpdateNotificationDto) {
    return await this.notificationService.update(id, updateNotificationDto);
  }
/*
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.notificationService.remove(id);
  }
    */

  @Post(':id/send')
  async sendNotification(@Param('id') id: number) {
    await this.notificationService.sendNotification(id);
  }
}
