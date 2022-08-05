export interface UserTitlesResponse {
    /** The list of games played by the user. */
    trophyTitles: TrophyTitle[];
    /** The number of `TrophyTitle` entities returned from the PSN API. */
    totalItemCount: number;
    /** Moves forward from the first results returned from from the PSN API. */
    nextOffset?: number;
    /** Moves backwards from the last result returned from from the PSN API. */
    previousOffset?: number;
}