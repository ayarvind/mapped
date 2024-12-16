import { Request, Response } from "express";
import ServerResponse from "@/interfaces/response";
import userAgentParser from "../../helper/user-agent-parser";
import { prisma } from "../../config/prisma";
import urlClickEventLogs from "../../kafka/producers/url-click-event-logs";
async function redirectToLonUrl(request: Request, response: Response<ServerResponse>) {
    const { shortUrl } = request.params;
    const userAgent = request.headers['user-agent'];
    const ipAddress = (request.headers['x-forwarded-for'] || request.ip || '') as string;

    const userAgentParsed = userAgentParser(userAgent);
    const shortUrlData = await prisma.urlShortener.findUnique({
        where: {
            shortUrl,
        },
    })

    if (!shortUrlData) {
        response.status(404).json({
            status: "error",
            message: "URL not found",
        });
        return;
    }

    const currentTimestamp = new Date();
    if (shortUrlData.expiration && shortUrlData.expiration < currentTimestamp) {
        response.status(400).json({
            status: "error",
            message: "URL expired",
        });
        return;
    }



    const logs = {
        timestamp: new Date(),
        ip: ipAddress,
        userAgent: userAgentParsed,
        urlShortenerId: shortUrlData.id,
    };

    urlClickEventLogs(logs);

    response.redirect(shortUrlData.longUrl);


}

export default redirectToLonUrl