import { OverallAnalytics } from '@/interfaces/response';
import { prisma } from '../../config/prisma';
import { Request, Response } from 'express';
import { subDays, isWithinInterval, format } from 'date-fns';

export default async function overall(request: Request, response: Response) {
    try {
        // Consolidate total counts and aggregations

        const urlStats = await prisma.urlShortener.aggregate({
            where: {
                userId: request.body.id
            },
            _count: { id: true },
            _sum: { clicksCount: true, uniqueClicksCount: true },

        });

        const totalUrls = urlStats._count.id;
        const totalClicks = urlStats._sum.clicksCount || 0;
        const uniqueClicks = urlStats._sum.uniqueClicksCount || 0;

        // Fetch all clicks data in one go
        const clicksData = await prisma.clicks.findMany({
            select: {
                timestamp: true,
                userOs: true,
                userDevice: true,
                userIp: true,
                urlShortenerId: true,
            },
            where: {
                urlShortener: {
                    userId: request.body.id
                }
            }

        });


        interface ClickCount {
            totalClicks: number;
            uniqueClicks: Set<string>;
        }
        const osStats: Record<string, ClickCount> = {};
        const deviceStats: Record<string, ClickCount> = {};
        const clickByDate: Record<string, number> = {};



        const today = new Date();
        const sevenDaysAgo = subDays(today, 7);

        clicksData.forEach(({ timestamp, userOs, userDevice, urlShortenerId }) => {
            // Group OS stats
            const osName = userOs || 'Unknown';
            osStats[osName] = osStats[osName] || {
                totalClicks: 0,
                uniqueClicks: new Set(),
            }
            osStats[osName].totalClicks++;
            osStats[osName].uniqueClicks.add(`${userOs}-${urlShortenerId.toString()}`);


            // Group device stats
            const deviceName = userDevice || 'Unknown';
            deviceStats[deviceName] = deviceStats[deviceName] || {
                totalClicks: 0,
                uniqueClicks: new Set(),
            }
            deviceStats[deviceName].totalClicks++;
            deviceStats[deviceName].uniqueClicks.add(`${userDevice}-${urlShortenerId.toString()}`);


            // Group clicks for last 7 days
            if (isWithinInterval(timestamp, { start: sevenDaysAgo, end: today })) {
                const formattedDate = format(timestamp, 'yyyy-MM-dd');
                clickByDate[formattedDate] = (clickByDate[formattedDate] || 0) + 1;
            }
        });


        // Transform results into desired format
        const osType = Object.entries(osStats).map(([osName, totalClicks]) => ({
            osName,
            totalClicks: totalClicks.totalClicks,
            uniqueClicks: totalClicks.uniqueClicks.size,
        }));
        const deviceType = Object.entries(deviceStats).map(([deviceName, totalClicks]) => ({
            deviceName,
            totalClicks: totalClicks.totalClicks,
            uniqueClicks: totalClicks.uniqueClicks.size,
        }));
        const clickByDate_ = Object.entries(clickByDate).map(([date, totalClicks]) => ({ date, totalClicks }));

        // Final response
        const responseData: OverallAnalytics = {
            totalUrls,
            totalClicks,
            uniqueClicks,
            osType,
            deviceType,
            clickByDate: clickByDate_,
        };

        response.status(200).json(responseData);
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: 'Internal server error' });
    }
}
