import { Kafka } from "kafkajs";
const brokers  =  process.env.KAFKA_BROKERS;
if(!brokers){
    throw new Error('Please provide a kafka brokers in env file');

}

const url = brokers.split(',');
const kafka = new Kafka({
    clientId:'mapped',
    brokers: url
})

export default kafka;