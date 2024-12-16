import { NewShortnerReqBody } from "@/interfaces/request";
import ServerResponse from "@/interfaces/response";
import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../../config/prisma";
import { checkIfCustomAliasExists } from "../../helper/customAlias";
import generateShortUrl from "../../helper/generateShortUrl";

const newShortnerSchema = z.object({
    longUrl: z.string().url("Invalid URL"),
    topicIds: z.array(z.number()).optional(),
    customAlias: z.string().optional(),
    expiration: z.date().optional(),
});

async function newShortner(request: Request, response: Response<ServerResponse>) {
    const requestBody = request.body as NewShortnerReqBody;

    try {
        const { longUrl, topicIds, customAlias,expiration } = newShortnerSchema.parse(requestBody);

        // Validate topics if topicId is provided
        if (topicIds && topicIds.length > 0) {
            const topics = await prisma.topics.findMany({
                where: {
                    id: {
                        in: topicIds,
                    },
                },
            });

            const invalidTopicIds = topicIds.filter(id => !topics.some(topic => topic.id === id));

            if (invalidTopicIds.length > 0) {
                response.status(400).json({
                    status: "error",
                    message: `Invalid topic ID(s): ${invalidTopicIds.join(", ")}`,
                });
                return;
            }
        }

        // Check for custom alias conflicts if customAlias is provided
        if (customAlias) {
            let alias = await checkIfCustomAliasExists(customAlias);
            if (alias) {
                response.status(400).json({
                    status: "error",
                    message: `Custom alias "${customAlias}" already exists. Please choose another alias.`,
                });
                return;
            }
        }

        const shortner = await prisma.urlShortener.create({
            data: {
                user: { connect: { id: requestBody.user.id } },
                longUrl,
                topics: {
                    connect: topicIds?.map(id => ({ id })),
                },
                expiration,
            },
        });

        const updatedShortner = await prisma.urlShortener.update({
            where: { id: shortner.id },
            data: {
                shortUrl: generateShortUrl(customAlias, shortner.id),
            },
        });

        if (customAlias) {
            await prisma.customAlias.create({
                data: {
                    alias: customAlias,
                    urlShortener: { connect: { id: shortner.id } },
                },
            });
        }

        response.status(201).json({
            status: "success",
            message: "Short URL created successfully.",
            data: updatedShortner,
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            response.status(400).json({
                status: "error",
                message: error.errors.map(err => err.message).join(", "),
            });
        } else {
            console.error("Error creating short URL:", error);
            response.status(500).json({
                status: "error",
                message: "An unexpected error occurred. Please try again later.",
            });
        }
    }
}



export default newShortner;
