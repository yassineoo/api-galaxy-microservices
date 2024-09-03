import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Kafka, Consumer,logLevel } from 'kafkajs';
import {NotificationService} from "../notification/notification.service"
import { CreateNotificationDto } from 'src/notification/dto/create-notification.dto';
const KAFKA_BROKER = process.env.KAFKA_BROKER
console.log("KAFKA BROKER",KAFKA_BROKER)
@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
    constructor(private readonly notificationService: NotificationService) {}
    private readonly kafka = new Kafka({
    logLevel:logLevel.DEBUG,
    clientId: 'notification-service',
    brokers: [KAFKA_BROKER], // Point to your Kafka broker
  });
  //private readonly notificationservice : NotificationService;
  private readonly consumer: Consumer = this.kafka.consumer({ groupId: 'notification-group' });
  //private readonly producer: Producer = this.kafka.producer();

  async onModuleInit() {
    await this.consumer.connect();
    //await this.producer.connect();
    console.log("consumer connected ...")
    await this.consumer.subscribe({ topics:["update-earning-percentage","update-terms-conditions","update-privacy-policy","publish-API"], fromBeginning: true });
    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log({
          value: message.value.toString(),
        });
        this.handleMessage(topic,message.value.toString());
      },
    });
  }

  async onModuleDestroy() {
    await this.consumer.disconnect();
    //await this.producer.disconnect();
  }

  private handleMessage(topic:string,message: string) {
    //console.error(message,"messageeeeeeeeeeeeeeee")
    //console.log("topic",topic)
    switch(topic){
        case "update-earning-percentage":
            this.notificationService.create({
                "message":`earning percentage will be updated after 7 days from now to ${message}`,
                "title":"Earning percentage",
                "recipient_id":null
            })
            break;
        case "update-terms-conditions":
            this.notificationService.create({
                "message":"Dear sir, our terms and conditions has been modified",
                "title":"Terms and conditions Update",
                "recipient_id":0
            })
            break;
        case "update-privacy-policy":
            this.notificationService.create({
                "message":"Dear sir, our privacy policy has been modified",
                "title":"Privacy  Policy",
                "recipient_id":0
            })
            break;
        case "publish-API":
          this.notificationService.create({
            message,
            "title":"new API Published !",
            "recipient_id":0
          })
          break;
        
    }
    //const event = JSON.parse(message);
    // here we create a new notifiation and notify its recipient
  }

}
