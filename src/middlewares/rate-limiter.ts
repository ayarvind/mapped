import ServerResponse from '@/interfaces/response';
import { NextFunction, Request, Response } from 'express';
import redisClient from '../config/redis';

async function rateLimiter(request: Request, response: Response<ServerResponse>, next: NextFunction) {
    const ipAddress = request.headers['x-forwarded-for'] || request.ip;
    const key = `rate-limiter:${ipAddress}`;
    const limit = parseInt(process.env.RATE_LIMITS || '10', 10);
    const ttl = 60; //  in seconds

    try {
        const currentCount = await redisClient.incr(key);

        if (currentCount === 1) {
            // First time the key is incremented, set expiration
            await redisClient.expire(key, ttl);
        }

        if (currentCount > limit) {
            console.log(`Rate limiter exceeded for IP: ${ipAddress}`);
            response.status(429).send({
                status: "error",
                message: "Too many requests"
            });
            return;
        }

        console.log(`IP: ${ipAddress}, Count: ${currentCount}`);
        next();
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error in rate limiter:', error.message);
            console.error('Stack trace:', error.stack);
        }
        response.status(500).send({
            status: 'error',
            message: 'Internal Server Error',
        });
    }
}

export default rateLimiter;
