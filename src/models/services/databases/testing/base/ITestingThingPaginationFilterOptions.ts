import type { DiscordSnowflake } from "../../../discord/base/types/DiscordSnowflake"

/**
 * @summary The testing thing pagination filter options interface.
 * @description This interface represents the filter options for paginating testing things.
 */
interface ITestingThingPaginationFilterOptions {
    /**
     * @summary The ID of the guild to filter testing things by.
     * @description ID of the guild to filter testing things by.
     */
    readonly guildId?: DiscordSnowflake
    /**
     * @summary The minimum number of participants to filter testing things by.
     * @description Minimum number of maximum participants to filter testing things by.
     */
    readonly minimumMaxParticipants?: number
    /**
     * @summary The maximum number of participants to filter testing things by.
     * @description Maximum number of maximum participants to filter testing things by.
     */
    readonly maximumMaxParticipants?: number
    /**
     * @summary The start date to filter testing things by.
     * @description Start date to filter testing things by.
     */
    readonly startsAt?: Date
    /**
     * @summary The end date to filter testing things by.
     * @description End date to filter testing things by.
     */
    readonly endsAt?: Date
}

export type { ITestingThingPaginationFilterOptions }
