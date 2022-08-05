import {
    AuthTokensResponse,
    exchangeCodeForAccessToken,
    exchangeNpssoForCode,
    exchangeRefreshTokenForAuthTokens
} from "psn-api";

class AuthenticationRepository {

    async getAuthToken(): Promise<AuthTokensResponse> {
        const npsso = process.env.NPSSO!;
        const accessCode = await exchangeNpssoForCode(npsso);
        const authorization = await exchangeCodeForAccessToken(accessCode);

        return authorization;
    };

    async getRefreshedAuthToken(token: any): Promise<AuthTokensResponse> {
        const userRefreshToken = await exchangeRefreshTokenForAuthTokens(
            token.refreshToken);

        return userRefreshToken;
    }

};

export default new AuthenticationRepository();