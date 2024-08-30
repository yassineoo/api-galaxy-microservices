import {v4 as uuidv4} from "uuid"
import {Kafka, logLevel,CompressionTypes} from 'kafkajs'
// kafka to be launched need at least one message broker and zodkeeper
// in our case we will use RedPanda
import {config} from "dotenv"
config()
const KAFKABROKER = process.env.KAFKA_BROKER!
//console.log("my kafka broker is accessible via",KAFKABROKER)
// declare kafka instance 
export const kafka = new Kafka({
    logLevel: logLevel.DEBUG,
    brokers: [KAFKABROKER],
    clientId: 'user-service',
  })

  const producer = kafka.producer()
  export const getRandomKey = ()=> Math.floor(Math.random() * 100)
  

  export const connectProducer = async ()=>{
    await producer.connect()
    console.log("producer connected ...")
  }

  export const sendMessage =(topic:string,key:number,message:string)=>{
    return producer.send({
      topic,
      messages:[{ key:`${key}`,value:message }]
    })
  }