import { Request, Response } from "express";
import { prisma } from '../../config/prisma';
import ServerResponse from "@/interfaces/response";
import AuthUser from "@/interfaces/auth";



async function getTopics(request: Request, response: Response<ServerResponse>) {
    const user = request.body.user as AuthUser;
    try{
        const topics = await prisma.topics.findMany({
            where: {
                userId: user.id
            },
            select:{
                name: true,
                id: true,
                createdAt: true,
                updatedAt: true,


            }
        });
        response.status(200).json({
            status: 'ok',
            data: topics
        });
    }catch(error){
        console.error("Error getting topics:", error);
        response.status(500).json({
            status: 'error',
            message: 'An error occurred while getting topics.'
        });
    }
}

export default getTopics;
