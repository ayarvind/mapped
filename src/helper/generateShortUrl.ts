const charset = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

export function base62Encode(num: number): string {
    if (num === 0) return charset[0];
    let result = "";
    while (num > 0) {
        result = charset[num % 62] + result;
        num = Math.floor(num / 62);
    }
    return result;
}

export function base62Decode(str: string): number {
    return [...str].reduce((acc, char) => acc * 62 + charset.indexOf(char), 0);
}


function generateShortUrl(customAlias?: string, shortnerId?: number): string | undefined {
    // Prioritize custom alias if provided
    if (customAlias) return customAlias;

    // Generate base62-encoded string if shortnerId is provided
    if (shortnerId !== undefined) return base62Encode(shortnerId);

    return undefined;
}

export default generateShortUrl;
