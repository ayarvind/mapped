import AuthUser from "@/interfaces/auth";
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { pathToRegexp } from 'path-to-regexp';

export default function auth(req: Request, res: Response, next: NextFunction) {
    // Define exact unprotected routes
    const unprotectedRoutes: string[] = [
        '/health',
        '/',
        '/auth',
    ];

    const unProtectedParamRoutes: string[] = [
        '/shorten/:shortUrl',
    ];

    if (unprotectedRoutes.includes(req.path)) {
        return next();
    }

    const isProtectedParamRoute = unProtectedParamRoutes.some((routePattern) => {
        const regex = pathToRegexp(routePattern);
        return regex.regexp.test(req.path);
    });

    if (isProtectedParamRoute) {
        return next();
    }
    const token = req.header('x-auth-token');
    if (!token) {
        res.status(401);
        return next(new Error('Access denied. No token provided.'));
    }


    // Verify JWT token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
        req.body.user = decoded as AuthUser; // Attach decoded user to request body
        next(); 
    } catch (error) {
        console.error('JWT verification error:', error);
        res.status(400).json({ message: 'Invalid token' });
    }
}
