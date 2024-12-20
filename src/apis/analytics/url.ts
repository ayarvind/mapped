import { prisma } from "../../config/prisma";
import ServerResponse, { URLAnalytics } from "@/interfaces/response";
import { Request, Response } from "express";

async function urlAnalytics(request: Request, response: Response<URLAnalytics | ServerResponse>) {
  const { alias } = request.params;
  try {
    const exist = await prisma.urlShortener.findUnique({
      where: { shortUrl: alias },
    });

    if (!exist) {
        response.status(404).json({ status: 'error', message: 'URL not found' });
        return;
    }

    const totalClicks = exist.clicksCount;
    const uniqueClicks = exist.uniqueClicksCount;

    // Fetch click count by date within the last 7 days using greater than query
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const clickByDate = await prisma.clicks.groupBy({
      by: ['timestamp'],
      _count: { id: true },
      where: {
        urlShortenerId: exist.id,
        timestamp: { gt: sevenDaysAgo }, 
      },
      orderBy: { timestamp: 'desc' },
    });

    const clickByDateResponse: Record<string, number> = {};

    clickByDate.forEach((click) => {
      const clickDate = new Date(click.timestamp).toISOString().split('T')[0];
      clickByDateResponse[clickDate] = (clickByDateResponse[clickDate] || 0) + click._count.id;
    });

    const sevenDaysClicksResponse = Object.keys(clickByDateResponse).map((date) => ({
      date,
      totalClicks: clickByDateResponse[date],
    }));

    // Get detailed stats for OS and Device type
    const clickDetails = await prisma.clicks.findMany({
      where: { urlShortenerId: exist.id },
      select: { userOs: true, userDevice: true },
    });

    const osStats: Record<string, { totalClicks: number; uniqueClicks: Set<string> }> = {};
    const deviceStats: Record<string, { totalClicks: number; uniqueClicks: Set<string> }> = {};

    clickDetails.forEach(({ userOs, userDevice }) => {
      const os = userOs || 'Unknown';
      const device = userDevice || 'Unknown';

      osStats[os] = osStats[os] || { totalClicks: 0, uniqueClicks: new Set() };
      deviceStats[device] = deviceStats[device] || { totalClicks: 0, uniqueClicks: new Set() };

      osStats[os].totalClicks++;
      deviceStats[device].totalClicks++;

      osStats[os].uniqueClicks.add(userOs || 'Unknown');
      deviceStats[device].uniqueClicks.add(userDevice || 'Unknown');
    });

    const osTypeResponse = Object.keys(osStats).map((osName) => ({
      osName,
      totalClicks: osStats[osName].totalClicks,
      uniqueClicks: osStats[osName].uniqueClicks.size,
    }));

    const deviceTypeResponse = Object.keys(deviceStats).map((deviceName) => ({
      deviceName,
      totalClicks: deviceStats[deviceName].totalClicks,
      uniqueClicks: deviceStats[deviceName].uniqueClicks.size,
    }));

    response.status(200).json({
      totalClicks,
      uniqueClicks,
      lastAccessed: exist.lastAccessed?.toString(),
      clickByDate: sevenDaysClicksResponse,
      osType: osTypeResponse,
      deviceType: deviceTypeResponse,
    });
  } catch (error) {
    console.error('Error fetching URL analytics:', error);
    response.status(500).json({ status: 'error', message: 'Internal server error' });
  }
}

export default urlAnalytics;
