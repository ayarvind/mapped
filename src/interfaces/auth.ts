export default interface AuthUser {
    email: string;
    name: string;
    id: number;
}


export interface AuthResponse {
    message: string;
    details?: string;
    token?: string;
    user?: {
        id: number;
        email: string;
        name: string;
    };
}
