import { NextFunction, Request, Response } from "express";
import authenticationRepository from "../repositories/authentication.repository";


async function authenticationMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const token = await authenticationRepository.getAuthToken();

        const now = new Date();
        const expirationDate = new Date(
            now.getTime() + token.expiresIn * 1000
        ).toISOString();

        const isAccessTokenExpired = new Date(expirationDate).getTime() < now.getTime();

        if (isAccessTokenExpired) {
            const userRefreshToken = await authenticationRepository.getRefreshedAuthToken(token);

            req.body = userRefreshToken;
        } else {
            req.body = token;
        }

        next();
    } catch (err) {
        next(err)
    };
};

export default authenticationMiddleware;