import { NextFunction, Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import authenticationMiddleware from "../middlewares/authentication.middleware";
import BasicError from "../errors/basic.error";
import searchRepository from "../repositories/search.repository";


const trophiesRoute = Router();

trophiesRoute.get('/trophies/:game/', authenticationMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.body;
        const gameId = req.params.game;
        const trophyList = await searchRepository.getCompleteTrophyListData(token, gameId, "all", "trophy");

        const { totalItemCount } = trophyList;
        if (!totalItemCount) throw new BasicError("Bad Request: Invalid Game ID.", 400);

        res.status(StatusCodes.OK).json(trophyList);
    } catch (err) {
        next(err);
    }
});

trophiesRoute.get('/trophies/:game/collection', authenticationMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.body;
        const gameId = req.params.game;
        const trophyCollection = await searchRepository.getTrophyListData(token, gameId, "trophy");

        const { definedTrophies } = trophyCollection;
        if (!definedTrophies) throw new BasicError("Bad Request: Invalid Game ID.", 400);

        res.status(StatusCodes.OK).json(trophyCollection);
    } catch (err) {
        next(err);
    }
});

trophiesRoute.get('/trophies/ps5/:game/', authenticationMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.body;
        const gameId = req.params.game;
        const trophyList = await searchRepository.getCompleteTrophyListData(token, gameId, "all");

        const { totalItemCount } = trophyList;
        if (!totalItemCount) throw new BasicError("Bad Request: Invalid Game ID.", 400);

        res.status(StatusCodes.OK).json(trophyList);
    } catch (err) {
        next(err);
    }
});

trophiesRoute.get('/trophies/ps5/:game/collection', authenticationMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.body;
        const gameId = req.params.game;
        const trophyCollection = await searchRepository.getTrophyListData(token, gameId);

        const { definedTrophies } = trophyCollection;
        if (!definedTrophies) throw new BasicError("Bad Request: Invalid Game ID.", 400);

        res.status(StatusCodes.OK).json(trophyCollection);
    } catch (err) {
        next(err);
    }
});

export default trophiesRoute;