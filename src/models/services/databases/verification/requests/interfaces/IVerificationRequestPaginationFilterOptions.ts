import type { DiscordSnowflake } from "@/oliverperzyk/models/services/discord/base/types/DiscordSnowflake"
import type { VerificationRequestState } from "../enums/VerificationRequestState"

/**
 * @summary Represents the pagination filter options for verification requests.
 * @description This interface is used to store the pagination filter options for verification requests.
 */
interface IVerificationRequestPaginationFilterOptions {
    /**
     * @summary The state of the verification requests.
     * @description The state of the verification requests.
     */
    readonly state?: VerificationRequestState
    /**
     * @summary The ID of the guild.
     * @description The ID of the guild.
     */
    readonly guildId?: DiscordSnowflake
    /**
     * @summary The ID of the user.
     * @description The ID of the user.
     */
    readonly userId?: DiscordSnowflake
}

export type { IVerificationRequestPaginationFilterOptions }
