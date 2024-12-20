import { Request, Response } from "express";
import { prisma } from "../../config/prisma";

async function topicwiseAnalytics(request: Request, response: Response) {
    try {
        const { user } = request.body;
        const topicName = request.params.topicName;

        const topics = await prisma.topics.findFirst({
            where: {
                name: topicName,
                userId: user.id,
            },
            select: {
                urlShortener: {
                    select: {
                        longUrl: true,
                        shortUrl: true,
                        clicksCount: true,
                        uniqueClicksCount: true,
                        lastAccessed: true,
                        createdAt: true,
                        clicks: {
                            where: {
                                timestamp: {
                                    gte: new Date(new Date().setDate(new Date().getDate() - 7)),
                                },
                            },
                            select: {
                                timestamp: true,
                            },
                            orderBy: {
                                timestamp: "desc",
                            },
                        },
                    },
                },
            },
        });

        // Early exit if no topic found
        if (!topics) {
            response.status(404).json({
                status: "error",
                message: "Topic not found",
            });
            return;
        }

        const totalClicks =
            topics.urlShortener?.reduce((acc, url) => acc + url.clicksCount, 0) || 0;
        const uniqueClicks =
            topics.urlShortener?.reduce((acc, url) => acc + url.uniqueClicksCount, 0) || 0;

        const clickByDateResponse: Record<string, number> = {};
        topics.urlShortener?.forEach((url) => {
            url.clicks.forEach((click) => {
                const clickDate = new Date(click.timestamp).toISOString().split("T")[0];
                clickByDateResponse[clickDate] = (clickByDateResponse[clickDate] || 0) + 1;
            });
        });

        const sevenDaysClicksResponse = Object.keys(clickByDateResponse).map((date) => ({
            date,
            totalClicks: clickByDateResponse[date],
        }));

        const currentHost = request.get("host");

        const urls = topics.urlShortener?.map((url) => ({
            longUrl: url.longUrl,
            shortUrl: `${currentHost || ''}/shorten/${url.shortUrl}`,
            clicksCount: url.clicksCount,
            uniqueClicksCount: url.uniqueClicksCount,
            lastAccessed: url.lastAccessed,
            createdAt: url.createdAt,
        })) || [];

        const responseObject = {
            totalClicks,
            uniqueClicks,
            date: sevenDaysClicksResponse,
            urls, 
        };

        response.status(200).json({
            status: "ok",
            data: responseObject,
        });
    } catch (error) {
        console.error("Error in topicwiseAnalytics:", error);
        response.status(500).json({
            status: "error",
            message: "An error occurred while processing the request.",
        });
    }
}

export default topicwiseAnalytics;
