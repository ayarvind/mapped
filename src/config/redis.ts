import { createClient } from 'redis';

// Build the Redis server URL from the environment variables
const redisHost = process.env.REDIS_HOST;
const redisPort = process.env.REDIS_PORT;

if (!redisHost || !redisPort) {
    throw new Error("Missing REDIS_HOST or REDIS_PORT environment variables");
}

// Construct the Redis URL
const redisUrl = `redis://${redisHost}:${redisPort}`;
console.log('Connecting to Redis:', redisUrl);

// Create the Redis client
const redisClient = createClient({
    url: redisUrl,
    socket: {
        connectTimeout: 5000,
    }
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

(async () => {
    try {
        await redisClient.connect();
        console.log('Redis connected!');
    } catch (error) {
        console.error('Error connecting to Redis:', error);
    }
})();

export default redisClient;
