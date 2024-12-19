import { Kafka } from "kafkajs";

// Get Kafka brokers from environment variables
const brokers = process.env.KAFKA_BROKERS;

console.log('Brokers:', brokers);

if (!brokers) {
    throw new Error('Please provide Kafka brokers in the environment variables');
}


const url = brokers.split(',');
const kafka = new Kafka({
    clientId: 'mapped',
    connectionTimeout:5000,
    brokers: url
});

console.log('Kafka client initialized successfully');


export default kafka;
