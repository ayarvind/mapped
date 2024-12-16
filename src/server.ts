import dotenv from 'dotenv';
import express from 'express'
import router from './apis/api'
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler, notFound} from './middlewares/errorHandler';
import auth from './middlewares/auth';
import { createTopics } from './kafka/admin';
import urlClickEventLogsConsumer from './kafka/consumers/url-click-event-logs-consumer';
dotenv.config();
const app = express();
const port = process.env.PORT || 5000;
app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_URL
}));

app.use(helmet());
app.use(auth);
app.use('/api/v1', router);

app.get('/health', (_, res) => {
    res.status(200).send('OK');
})


app.use(notFound);
app.use(errorHandler);



app.listen(port, () => {
    createTopics();
    urlClickEventLogsConsumer()



    console.log(`Server is running on port ${port}`);
})






