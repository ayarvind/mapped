export default interface ServerResponse {
    status: string;
    message?: string;
    error?: string;
    data?: unknown;
}

export interface OSTypeResponse {
    osName: string;
    uniqueClicks?: number;
    totalClicks: number;
    uniqueUsers?: number;

}

export interface DeviceTypeResponse {
    deviceName: string
    uniqueClicks?: number;
    totalClicks: number;
    uniqueUsers?: number;
}
export interface OverallAnalytics {
    totalUrls: number;
    totalClicks: number;
    clickByDate: {
        date: string; //only for recent seven days
        totalClicks: number;
    }[]
    uniqueClicks: number;
    osType: OSTypeResponse[];
    deviceType: DeviceTypeResponse[];
}

export interface URLAnalytics {
    totalClicks: number;
    lastAccessed?: string;
    clickByDate: {
        date: string;
        totalClicks: number;
    }[]
    uniqueClicks: number;
    osType: OSTypeResponse[];
    deviceType: DeviceTypeResponse[];
}