import UserAgent from "./user-agent";

export interface URLClickEventLogs{
    urlShortenerId: number;
    timestamp: Date;
    ip: string;
    userAgent: UserAgent | null;

}