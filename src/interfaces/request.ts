import AuthUser from "./auth";

export interface NewShortnerReqBody{
    user : AuthUser;
    longUrl : string;
    topicIds ?: number[];
    customAlias ?: string; 
    date ?: Date;

}