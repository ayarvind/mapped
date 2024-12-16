const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const base = charset.length;
export function baseEncode(num: number): string {
    console.log(num);
    if (num === 0) return charset[0];
    let result = "";
    while (num > 0) {
        result = charset[num % base] + result;
        num = Math.floor(num / base);
    }
    console.log({
        result
    })
    return result;
}

export function baseDecode(str: string): number {
    return [...str].reduce((acc, char) => acc * base + charset.indexOf(char), 0);
}


function generateShortUrl(customAlias?: string, shortnerId?: number): string | undefined {
    // Prioritize custom alias if provided
    if (customAlias) return customAlias;

    // Generate base62-encoded string if shortnerId is provided
    if (shortnerId !== undefined) return baseEncode(shortnerId);

    return undefined;
}

export default generateShortUrl;
