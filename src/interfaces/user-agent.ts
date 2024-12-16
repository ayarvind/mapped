export default interface UserAgent {
    device: {
        type: string; 
        brand: string; 
        os: {
            name: string; 
            version: string;
        },
        browser: {
            name: string; 
            version: string;
        }

    };
}
