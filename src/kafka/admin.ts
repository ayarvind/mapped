import kafka from '../config/kafka-client';

export async function createTopics() {
    const admin = kafka.admin();

    console.log("Admin connecting...");
    await admin.connect();
    console.log("Admin Connection Success...");

    console.log("Creating Topic [url-click-event-logs]...");
    const result = await admin.createTopics({
        topics: [
            {
                topic: "url-click-event-logs",
                numPartitions: 2,
            },
            {
                topic : "dead-letter-queue-event-logs",
                numPartitions:2,
            }
        ],
    });

    if (result) {
        console.log("Topic Created Successfully [url-click-event-logs]");
    } else {
        console.log("Topic already exists [url-click-event-logs]");
    }

    console.log("Disconnecting Admin...");
    await admin.disconnect();
}
