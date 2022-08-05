import { NextFunction, Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import { UserTitlesResponse } from '../models/user-title-response-pagination';
import authenticationMiddleware from "../middlewares/authentication.middleware";
import searchRepository from "../repositories/search.repository";
import BasicError from "../errors/basic.error";
import _ from "lodash";

const usersRoute = Router();

usersRoute.get('/:id', authenticationMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const username = req.params.id;
        const token = req.body;
        const user = await searchRepository.findUser(token, username);

        const results = user.domainResponses[0].totalResultCount;
        if (!results) throw new BasicError("PSN ID could not be found.", 404);

        res.status(StatusCodes.OK).json(user);
    } catch (err) {
        next(err);
    }
});

usersRoute.get('/:id/games/', authenticationMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.body;
        const username = req.params.id;
        const user = await searchRepository.findUser(token, username);

        const { accountId } = user.domainResponses[0].results[0].socialMetadata;
        const userGames = await searchRepository.getUserPlayedGames(token, accountId);
        const results = userGames.totalItemCount;

        if (!results) throw new BasicError("User has no played games.", 404);

        res.status(StatusCodes.OK).json(userGames);
    } catch (err) {
        next(err);
    }
});

usersRoute.get('/:id/games/all', authenticationMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.body;
        const username = req.params.id;
        const user = await searchRepository.findUser(token, username);
        const { accountId } = user.domainResponses[0].results[0].socialMetadata;

        const userGames: UserTitlesResponse = await searchRepository.getUserPlayedGames(token, accountId);

        const results = userGames.totalItemCount;
        if (!results) throw new BasicError("User has no played games.", 404);
        let offset = null;

        if ('nextOffset' in userGames) {
            offset = userGames.nextOffset;

            while (offset !== null) {
                const gameList: Promise<UserTitlesResponse> = await (
                    searchRepository.getUserPlayedGames(
                        token,
                        accountId,
                        { limit: 800, offset: offset }
                    )).then(res => Object.assign({
                        ...res
                    }));

                const nextOffset = (await gameList).nextOffset;
                const newList = (await gameList).trophyTitles;


                if (nextOffset) {
                    offset = nextOffset;
                    userGames.trophyTitles.push(...newList);
                } else {
                    offset = null;
                    userGames.trophyTitles.push(...newList);
                    delete userGames.nextOffset;
                    delete userGames.previousOffset;
                    break
                }
            }
        }

        res.status(StatusCodes.OK).json(userGames);
    } catch (err) {
        next(err);
    }
});

usersRoute.get('/:id/trophies/', authenticationMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.body;
        const username = req.params.id;
        const user = await searchRepository.findUser(token, username);
        const { accountId } = user.domainResponses[0].results[0].socialMetadata;

        const userGames: UserTitlesResponse = await searchRepository.getUserPlayedGames(token, accountId);

        const { trophyTitles } = userGames;
        const gameIds = trophyTitles.map(({ npCommunicationId, trophyTitlePlatform }) =>
            ({ npCommunicationId, trophyTitlePlatform }))

        const results = userGames.totalItemCount;
        if (!results) throw new BasicError("User has no played games.", 404);

        const gameTrophies = await Promise.all(gameIds.map(game =>
            searchRepository.getCompleteTrophyListData(
                token,
                game.npCommunicationId,
                "all",
                game.trophyTitlePlatform !== "PS5" ? "trophy" : undefined
            ))).then(data => data.map(t => t.trophies))

        const earnedTrophies = await Promise.all(gameIds.map(game =>
            searchRepository.getUserCompleteTrophyProgressForTitle(
                token,
                accountId,
                game.npCommunicationId,
                "all",
                game.trophyTitlePlatform !== "PS5" ? "trophy" : undefined
            ))).then(data => data.map(t => t.trophies))

        const mergedTrophies = _.merge(gameTrophies, earnedTrophies);

        const trophyList = {
            games: trophyTitles.map((game, i) => Object.assign({
                trophySet: game.trophySetVersion,
                gameName: game.trophyTitleName,
                gameDescription: game.trophyTitleDetail,
                platform: game.trophyTitlePlatform,
                gameImage: game.trophyTitleIconUrl,
                gameTrophies: game.definedTrophies,
                earnedTrophies: game.earnedTrophies,
                progress: game.progress,
                lastActivity: game.lastUpdatedDateTime
            }, {
                trophyList: mergedTrophies[i],
            })),
            totalItemCount: userGames.totalItemCount,
            nextOffset: userGames.nextOffset,
            prevOffset: userGames.previousOffset,
        };

        res.status(StatusCodes.OK).json(trophyList);
    } catch (err) {
        next(err);
    }
});

usersRoute.get('/:id/trophies/:game/', authenticationMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.body;
        const username = req.params.id;
        const gameId = req.params.game;

        const user = await searchRepository.findUser(token, username);
        const { accountId } = user.domainResponses[0].results[0].socialMetadata;

        const trophiesList = await searchRepository.getUserCompleteTrophyProgressForTitle(
            token, accountId, gameId, "all", "trophy"
        );

        res.status(StatusCodes.OK).json(trophiesList);
    } catch (err) {
        next(err);
    }
});

usersRoute.get('/:id/trophies/PS5/:game/', authenticationMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.body;
        const username = req.params.id;
        const gameId = req.params.game;

        const user = await searchRepository.findUser(token, username);
        const { accountId } = user.domainResponses[0].results[0].socialMetadata;

        const trophiesList = await searchRepository.getUserCompleteTrophyProgressForTitle(
            token, accountId, gameId, "all"
        );

        res.status(StatusCodes.OK).json(trophiesList);
    } catch (err) {
        next(err);
    }
});

usersRoute.get('/:id/trophies/:game/collection', authenticationMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.body;
        const username = req.params.id;
        const gameId = req.params.game;

        const user = await searchRepository.findUser(token, username);
        const { accountId } = user.domainResponses[0].results[0].socialMetadata;

        const trophiesCollection = await searchRepository.getUserTrophyProgressForTitle(
            token, accountId, gameId, "trophy"
        );

        res.status(StatusCodes.OK).json(trophiesCollection);
    } catch (err) {
        next(err);
    }
});

usersRoute.get('/:id/trophies/ps5/:game/collection', authenticationMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.body;
        const username = req.params.id;
        const gameId = req.params.game;

        const user = await searchRepository.findUser(token, username);
        const { accountId } = user.domainResponses[0].results[0].socialMetadata;

        const trophiesCollection = await searchRepository.getUserTrophyProgressForTitle(
            token, accountId, gameId
        );

        res.status(StatusCodes.OK).json(trophiesCollection);
    } catch (err) {
        next(err);
    }
});

usersRoute.get('/:id/summary', authenticationMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.body;
        const username = req.params.id;

        const user = await searchRepository.findUser(token, username);
        const { accountId } = user.domainResponses[0].results[0].socialMetadata;

        const profileSummary = await searchRepository.getUserTrophiesSummary(token, accountId);

        res.status(StatusCodes.OK).json(profileSummary);
    } catch (err) {
        next(err);
    }
});

export default usersRoute;

