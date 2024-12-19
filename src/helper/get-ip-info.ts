import IPInfo from "@/interfaces/IPInfo";

async function getIpInfo(ip: string): Promise<IPInfo> {
    try {
        const response = await fetch(`http://ip-api.com/json/${ip}`);
        const info: IPInfo = await response.json();
        return info;
    } catch (error:unknown) {
        console.error(error);
        return {
            ip,
            status: "failed",
            country: "",
            countryCode: "",
            region: "",
            regionName: "",
            city: "",
            zip: "",
            lat: 0,
            lon: 0,
            timezone: "",
            isp: "",
        }
    }
}

export default getIpInfo