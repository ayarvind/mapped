import { createClient } from 'redis';

const redisClient = createClient({ url: process.env.REDIS_SERVER! });
console.log('Connecting to Redis:', process.env.REDIS_SERVER);
redisClient.on('error', (err) => console.error('Redis Client Error', err));

(async () => {
    await redisClient.connect();
    console.log('Redis connected!');
})();

export default redisClient;
