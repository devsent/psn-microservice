import {
    getTitleTrophies,
    getTitleTrophyGroups,
    getUserTitles,
    getUserTrophiesEarnedForTitle,
    getUserTrophyGroupEarningsForTitle,
    getUserTrophyProfileSummary,
    makeUniversalSearch,
} from "psn-api";


class SearchRepository {

    async findUser(token: any, username: string) {
        const response = await makeUniversalSearch(
            token,
            username,
            "SocialAllAccounts"
        );

        return response;
    }

    async getUserPlayedGames(
        token: any,
        accountId: string,
        options?: {
            limit?: any,
            offset?: any
        }
    ) {
        const response = await getUserTitles(token, accountId, options);

        return response;
    }


    async getTrophyListData(
        token: any,
        gameId: string,
        platform?: "trophy"
    ) {
        const response = await getTitleTrophyGroups(token, gameId, {
            npServiceName: platform
        });

        return response;
    }

    async getCompleteTrophyListData(
        token: any,
        gameId: string,
        trophySet: string,
        platform?: "trophy"
    ) {
        const response = await getTitleTrophies(token, gameId, trophySet, {
            npServiceName: platform
        });

        return response;
    }

    async getUserTrophyProgressForTitle(
        token: any,
        accountId: string,
        gameId: string,
        platform?: "trophy"
    ) {
        const response = await getUserTrophyGroupEarningsForTitle(
            token,
            accountId,
            gameId,
            { npServiceName: platform }
        );

        return response;
    }

    async getUserCompleteTrophyProgressForTitle(
        token: any,
        accountId: string,
        gameId: string,
        trophySet: string,
        platform?: "trophy"
    ) {
        const response = await getUserTrophiesEarnedForTitle(
            token,
            accountId,
            gameId,
            trophySet,
            { npServiceName: platform }
        );

        return response;
    }

    async getUserTrophiesSummary(token: any, accountId: string) {
        const response = await getUserTrophyProfileSummary(token, accountId);

        return response;
    }
}

export default new SearchRepository();