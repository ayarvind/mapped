import { URLClickEventLogs } from "@/interfaces/Logs";
import kafka from "../../config/kafka-client";

const producer = kafka.producer();

async function initializeProducer() {
    await producer.connect();
}
initializeProducer().catch((err) => console.error('Kafka producer initialization failed', err));

export default async function urlClickEventLogs(logs: URLClickEventLogs) {
    try {
        await producer.send({
            topic: 'url-click-event-logs',
            messages: [
                {
                    value: JSON.stringify(logs),
                },
            ],
        });
    } catch (err) {
        console.error("Error sending log to Kafka:", err);
    }
}
