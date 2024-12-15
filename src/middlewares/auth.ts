import AuthUser from "@/interfaces/auth"
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';

export default function auth(req: Request, res: Response, next: NextFunction) {
    const unprotectedRoutes = [
        '/api/v1/health',
        '/',
        '/api/v1/auth'
    ];

    if (unprotectedRoutes.includes(req.path)) {
        return next();
    }

    const token = req.header('x-auth-token');
    if (!token) {
        res.status(401);
        return next(new Error('Access denied. No token provided.'));

    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
        req.body.user = decoded as AuthUser;

        next();
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: 'Invalid token' });
    }


}

 

