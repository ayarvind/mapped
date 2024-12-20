import { Request, Response } from "express";
import { prisma } from '../../config/prisma';
import ServerResponse from "../../interfaces/response";
import AuthUser from "@/interfaces/auth";

interface NewTopicRequestBody {
    topicName: string;
    user: AuthUser;
}

async function newTopic(request: Request, response: Response<ServerResponse>) {
    const { topicName, user } = request.body as NewTopicRequestBody;

    if (!topicName || !user || !user.id) {
        response.status(400).json({
            status: 'error',
            message: 'Invalid request. Please provide a valid topic name and user information.',
        });
        return;
    }

    try {
        await prisma.topics.create({
            data: {
                name: topicName,
                userId: user.id,
            },
        });

        response.status(201).json({
            status: 'ok',
            message: 'Topic created successfully',
        });
    } catch (error) {
        console.error("Error creating topic:", error);
        if (error instanceof Error && error.message.includes('Unique constraint failed on the fields: (`name`)')) {
            response.status(409).json({
                status: 'error',
                message: 'Topic with this name already exists.'
            });
            return;
        }
        response.status(500).json({
            status: 'error',
            message: 'An error occurred while creating the topic.',
        });
    }
}

export default newTopic;
