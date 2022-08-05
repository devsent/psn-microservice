import { NextFunction, Request, Response, Router } from "express";
import { StatusCodes } from 'http-status-codes';

const statusRoute = Router();

statusRoute.get('/status', (req: Request, res: Response, next: NextFunction) => {
    try {
        res.sendStatus(StatusCodes.OK);
    } catch (err) {
        next(err);
    }
});

export default statusRoute;