import { Request, Response } from "express";
import ServerResponse from "@/interfaces/response";
import userAgentParser from "../../helper/user-agent-parser";
import { prisma } from "../../config/prisma";
import urlClickEventLogs from "../../kafka/producers/url-click-event-logs";
import redisClient from "../../config/redis";

async function redirectToLonUrl(request: Request, response: Response<ServerResponse>) {
    const { shortUrl } = request.params;
    const userAgent = request.headers['user-agent'];
    const ipAddress = (request.headers['x-forwarded-for'] || request.ip || '') as string;

    const userAgentParsed = userAgentParser(userAgent);
    const redisKey = `url:${shortUrl}`;
    let shortUrlData = null;

    try {
        // Attempt to get data from Redis cache
        const cachedData = await redisClient.get(redisKey).catch((err) => {
            console.warn('Redis connection failed:', err);
            return null; // Fallback to database query if Redis fails
        });

        if (cachedData) {
            shortUrlData = JSON.parse(cachedData);
        } else {
            // Query database for shortUrl if not in cache
            shortUrlData = await prisma.urlShortener.findUnique({
                where: { shortUrl },
            });

            if (!shortUrlData) {
                response.status(404).json({
                    status: "error",
                    message: "URL not found",
                });
                return;
            }

            // Cache data in Redis with 60 seconds expiration
            redisClient.set(redisKey, JSON.stringify(shortUrlData), { EX: 60 * 10 }).catch((err) => {
                console.warn('Failed to cache data in Redis:', err);
            });
        }

        // Check expiration
        if (shortUrlData.expiration && new Date(shortUrlData.expiration) < new Date()) {
            response.status(400).json({
                status: "error",
                message: "URL expired",
            });
            return;
        }

        // Log the event
        const logs = {
            timestamp: new Date(),
            ip: ipAddress,
            userAgent: userAgentParsed,
            urlShortenerId: shortUrlData.id,
        };
        urlClickEventLogs(logs);

        // Redirect to the original long URL
        response.redirect(shortUrlData.longUrl);
    } catch (error) {
        console.error('Error redirecting to long URL:', error);
        response.status(500).json({ status: 'error', message: 'Internal server error' });
    }
}

export default redirectToLonUrl;
