import { OverallAnalytics } from '@/interfaces/response';
import { prisma } from '../../config/prisma';
import { Request, Response } from 'express';

export default async function overall(request: Request, response: Response) {
    try {
        const totalUrls = await prisma.urlShortener.count();
        const { _sum: { clicksCount: totalClicks } } = await prisma.urlShortener.aggregate({
            _sum: { clicksCount: true },
        });

        // Group data for clicks by date, OS, and device with unique user counts
        const clickStats = await Promise.all([
            prisma.clicks.groupBy({
                by: ['timestamp'],
                _count: { id: true },
            }),
            prisma.clicks.groupBy({
                by: ['userOs'],
                _count: { userOs: true },

            }),
            prisma.clicks.groupBy({
                by: ['userDevice'],
                _count: { userDevice: true },
            }),
        ]);

        const [clickByDate, osType, deviceType] = clickStats;

        // Prepare response data
        const osStats = osType.map(os => ({
            osName: os.userOs || 'Unknown',
            totalClicks: os._count.userOs,

        }));

        const deviceStats = deviceType.map(device => ({
            deviceName: device.userDevice || 'Unknown',
            totalClicks: device._count.userDevice,
        }));

        // Fetch unique clicks across all IPs
        const uniqueClicks = await prisma.clicks.groupBy({
            by: ['userIp'],
            _count: {
                userIp: true,
            },
        }).then(result => result.length);

        // Final response data
        const responseData: OverallAnalytics = {
            totalUrls,
            totalClicks: totalClicks || 0,
            uniqueClicks,
            osType: osStats,
            deviceType: deviceStats,
            clickByDate: Object.entries(clickByDate.reduce((acc: {
                [date: string]: number;
            }, click) => {
                const date = new Date(click.timestamp).toISOString().slice(0, 10);
                if (!acc[date]) {
                    acc[date] = 0;
                }
                acc[date] += click._count.id;

                return acc;
            }, {})).map(([date, totalClicks]) => ({ date, totalClicks }))
        };


        response.status(200).json(responseData);
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: 'Internal server error' });
    }
}
