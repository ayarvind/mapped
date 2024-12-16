export default interface ServerResponse {
    status: string;
    message?: string;
    error?: string;
    data?: any;
}