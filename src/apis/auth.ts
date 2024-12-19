import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { z, ZodError } from "zod";
import { AuthResponse } from "@/interfaces/auth";

const authSchema = z.object({
    email: z.string().email("Invalid email address"),
    googleSignInId: z.string(),
    name: z.string().min(1, "Name is required"),
});

export async function authHandler(req: Request, res: Response<AuthResponse>): Promise<void> {
    try {
        const { email, googleSignInId, name } = authSchema.parse(req.body);
        const hashedGoogleSignInId = await bcrypt.hash(googleSignInId, 10);
        const user = await prisma.user.upsert({
            where: { email },
            update: {
                updatedAt: new Date(),
            },
            create: {
                email,
                name,
                googleSignInId: hashedGoogleSignInId,
            },
        });

        // Generating JWT token
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            console.error("JWT_SECRET is missing");
            res.status(500).json({ message: "Internal server configuration error" });
            return;
        }

        const payload = {
            id: user.id,
            email: user.email,
            name: user.name
        };

        const token = jwt.sign(payload, jwtSecret, { expiresIn: "1d" });
        res.status(200).json({
            message: "User authenticated successfully",
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
        });
    } catch (error : unknown) {
        console.error("Error in authHandler:", error);
        if (error instanceof ZodError) {
            res.status(400).json({ message: "Validation error" });
        } else {
            res.status(500).json({ message: "Internal server error" });
        }
    }
}
