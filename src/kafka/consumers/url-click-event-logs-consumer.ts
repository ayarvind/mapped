import { URLClickEventLogs } from "@/interfaces/Logs";
import kafka from "../../config/kafka-client";
import { prisma } from '../../config/prisma';

const consumer = kafka.consumer({
    groupId: 'url-click-event-logs-consumer'
});

async function initializeConsumer() {
    await consumer.connect();
}

initializeConsumer().catch((err) =>
    console.error('Kafka consumer initialization failed', err)
);

export default async function urlClickEventLogsConsumer() {
    try {
        await consumer.subscribe({ topic: 'url-click-event-logs' });

        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {

                if (!message.value) {
                    console.error('Received message with null value');
                    return;
                }

                const logs = JSON.parse(message.value.toString()) as URLClickEventLogs;
                const MAX_RETRIES = process.env.MAX_RETRIES ? parseInt(process.env.MAX_RETRIES) : 3;

                let attempt = 0;
                while (attempt < MAX_RETRIES) {
                    try {

                        const uniqueClicks = await prisma.clicks.findFirst({
                            where: {
                                userIp: logs.ip,
                                urlShortenerId: logs.urlShortenerId,
                            },
                        })

                        await prisma.clicks.create({
                            data: {
                                userIp: logs.ip,
                                urlShortener: {
                                    connect: {
                                        id: logs.urlShortenerId,
                                    },
                                },
                                userOs: logs.userAgent?.device.os.name,
                                userDevice: logs.userAgent?.device.type,
                            },
                        });



                        if (uniqueClicks) {
                            console.log('Unique click not detected');
                        } else {
                            console.log('Unique click detected');
                        }

                        await prisma.urlShortener.update({
                            where: {
                                id: logs.urlShortenerId,
                            },
                            data: {
                                lastAccessed: logs.timestamp,
                                clicksCount: {
                                    increment: 1,
                                },
                                uniqueClicksCount: {
                                    increment: uniqueClicks ? 0 : 1
                                }
                            },
                        });

                        console.log(`Message processed successfully: ${message.offset}`);
                        return;
                    } catch (dbError) {
                        attempt++;
                        console.error(
                            `Database operation failed (attempt ${attempt} of ${MAX_RETRIES}):`,
                            dbError
                        );

                        if (attempt >= MAX_RETRIES) {
                            console.error(
                                `Message failed after ${MAX_RETRIES} attempts: ${message.offset}`
                            );
                            return;
                        }
                    }
                }
            },
        });
    } catch (error) {
        console.error("Error in urlClickEventLogsConsumer:", error);
    }
}
