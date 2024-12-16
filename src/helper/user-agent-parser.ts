import UserAgent from "@/interfaces/user-agent";

export default function userAgentParser(userAgent: string | undefined): UserAgent | null{
    if(!userAgent) return null;
    const browserRegex = /(Chrome|Safari|Firefox|Opera|Edg|MSIE|Trident)\/([\d.]+)/;
    const osRegex = /\(([^;]+);?[^)]*\)/;

    // Browser Detection
    const browserMatch = userAgent.match(browserRegex) || [];
    const browserName = browserMatch[1] || "Unknown";
    const browserVersion = browserMatch[2] || "Unknown";

    // OS Detection
    const osMatch = userAgent.match(osRegex) || [];
    const osInfo = osMatch[1]?.split(" ") || [];
    const osName = osInfo[0]?.trim() || "Unknown";
    const osVersion = osInfo[1]?.trim().replace(/_/g, ".") || "Unknown";

    // Device Type and Brand Detection
    let deviceType = "Desktop";
    if (userAgent.includes("Mobile")) {
        deviceType = "Mobile";
    } else if (userAgent.includes("Tablet")) {
        deviceType = "Tablet";
    }

    let brand = "Unknown";
    if (userAgent.includes("iPhone")) {
        brand = "iPhone";
    } else if (userAgent.includes("iPad")) {
        brand = "iPad";
    } else if (userAgent.includes("Macintosh")) {
        brand = "Mac";
    } else if (userAgent.includes("Windows")) {
        brand = "Windows PC";
    } else if (userAgent.includes("Linux")) {
        brand = "Linux PC";
    } else if (userAgent.includes("Android")) {
        brand = "Android";
    }

    // Return Parsed Result
    return {
        device: {
            type: deviceType,
            brand,
            os: {
                name: osName,
                version: osVersion,
            },
            browser: {
                name: browserName,
                version: browserVersion,
            },
        },
        
    };
}
