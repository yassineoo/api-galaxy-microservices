import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../utils/prisma';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createNotificationDto: CreateNotificationDto) {
    if (createNotificationDto.recipient_id == 0) {
      // add notification to  all the recipients
      // step 1 : fetch all the UserIDS
      console.log(
        'called from null',
        createNotificationDto.message,
        createNotificationDto.title,
      );
      const allusers = await this.prisma.user_entities.findMany({});
      //console.log(users)
      // step two : map over users and notifiy each one of them
      const created_notifications = allusers.map((user) =>
        this.prisma.notification_entities.create({
          data: {
            title: createNotificationDto.title,
            message: createNotificationDto.message,
            user_entities: {
              connect: {
                id: user.id, // Connect the notification to the user
              },
            },
          },
        }),
      );
      const data = await Promise.all(created_notifications);
      console.log('consumer connected topic 22222222222222222222');
      console.log('consumer connected topic 22222222222222222222');
      console.log('consumer connected topic 22222222222222222222');
      console.log('consumer connected topic 22222222222222222222');
      console.log('consumer connected topic 22222222222222222222');
      console.log('consumer connected topic 22222222222222222222');
      console.log('consumer connected topic 22222222222222222222');
      console.log('consumer connected topic 22222222222222222222');
      console.log('consumer connected topic 22222222222222222222');
      console.log('consumer connected topic 22222222222222222222');

      console.log('called from null', data);
      console.log('consumer connected topic 22222222222222222222');
      console.log('consumer connected topic 22222222222222222222');
      console.log('consumer connected topic 22222222222222222222');
      console.log('consumer connected topic 22222222222222222222');
      console.log('consumer connected topic 22222222222222222222');
      console.log('consumer connected topic 22222222222222222222');
      console.log('consumer connected topic 22222222222222222222');
      console.log('consumer connected topic 22222222222222222222');
      console.log('consumer connected topic 22222222222222222222');
      console.log('consumer connected topic 22222222222222222222');
      console.log('consumer connected topic 22222222222222222222');

      return true;
    } else if (!createNotificationDto.recipient_id) {
      const providers = await this.prisma.user_entities.findMany({
        where: {
          role: 'provider',
        },
      });
      //console.log(users)
      // step two : map over users and notifiy each one of them
      const created_notifications = providers.map((pro) =>
        this.prisma.notification_entities.create({
          data: {
            title: createNotificationDto.title,
            message: createNotificationDto.message,
            user_entities: {
              connect: {
                id: pro.id, // Connect the notification to the user
              },
            },
          },
        }),
      );
      await Promise.all(created_notifications);
      return true;
    } else {
      const data = this.prisma.notification_entities.create({
        data: {
          title: createNotificationDto.title,
          message: createNotificationDto.message,
          user_entities: {
            connect: {
              id: createNotificationDto.recipient_id,
            },
          },
        },
      });
      return true;
    }
  }

  async findAll() {
    return this.prisma.notification_entities.findMany();
  }

  async findOne(id: number) {
    const notification = await this.prisma.notification_entities.findUnique({
      where: { id },
    });
    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }
    return notification;
  }

  async update(id: number, updateNotificationDto: UpdateNotificationDto) {
    const notification = await this.findOne(id);
    return this.prisma.notification_entities.update({
      where: { id: notification.id },
      data: updateNotificationDto,
    });
  }

  /*
  async remove(id: number) {
    const notification = await this.findOne(id);
    await this.prisma.no.delete({
      where: { id: notification.id },
    });
  }
*/

  async getUserNotifications(userId: number) {
    let notifications = await this.prisma.notification_entities.findMany({
      where: {
        recipient_id: userId,
      },
    });
    const finalNotifications = JSON.stringify(notifications, (key, value) =>
      typeof value == 'bigint' ? value.toString() : value,
    );
    return finalNotifications;
  }
  async sendNotification(id: number) {
    const notification = await this.findOne(id);
    // Logic to send the notification (e.g., via email, push notification, etc.)
    console.log(
      `Sending notification: ${notification.title} to recipient ID ${notification.recipient_id}`,
    );
  }
}
