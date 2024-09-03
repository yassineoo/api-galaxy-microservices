import {Kafka,logLevel} from "kafkajs"
import dotenv from "dotenv"

dotenv.config()

const KAFKA_BROKER = process.env.KAFKA_BROKER!

const kafka = new Kafka({
    logLevel:logLevel.DEBUG,
    clientId:"auth-service",
    brokers:[KAFKA_BROKER]
})

// create producer 
const producer = kafka.producer()

// connect producer 
export const connectProducer = async()=>{
    await producer.connect()
}

// send messages 
export const sendMessage = async(topic:string,key:number,message:string)=>{
    return producer.send({
        topic,
        messages:[{ key:`${key}`,value:message }]
    })
}




