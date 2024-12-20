import dotenv from 'dotenv';
import express from 'express'
import router from './apis/api'
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler, notFound } from './middlewares/errorHandler';
import auth from './middlewares/auth';
import { createTopics } from './kafka/admin';
import urlClickEventLogsConsumer from './kafka/consumers/url-click-event-logs-consumer';
import redisClient from './config/redis';
import kafka from './config/kafka-client';
import rateLimiter from './middlewares/rate-limiter';
dotenv.config();
const app = express();
const port = process.env.PORT || 5000;
app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_URL
}));

app.use(helmet());
app.use(rateLimiter)
app.use(auth);
app.use('/', router);
app.get('/health', async (_, res) => {
    try {
        // Check Redis readiness
        const redisStatus = await redisClient.ping();
        if (redisStatus !== 'PONG') {
            res.status(500).json({
                status: 'DOWN',
                message: 'Redis Server is down'
            });
            return;
        }

        // Check Kafka readiness
        const admin = kafka.admin();
        await admin.connect();
        try {
            await admin.listTopics();
        } finally {
            await admin.disconnect();
        }

        // If all checks pass
        res.status(200).json({
            status: 'UP',
            message: 'All services are running'
        });
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.log('Error in health check');
        }
        res.status(500).json({
            status: 'DOWN',
            message: 'One or more services are down'
        });
    }
});


app.use(notFound);
app.use(errorHandler);



app.listen(port, () => {
    createTopics();
    urlClickEventLogsConsumer()



    console.log(`Server is running on port ${port}`);
})






