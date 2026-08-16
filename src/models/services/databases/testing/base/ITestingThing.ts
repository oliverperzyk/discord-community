import type { DiscordSnowflake } from "../../../discord/base/types/DiscordSnowflake"
import type { IBaseEntity } from "../../base/interfaces/IBaseEntity"

/**
 * @summary The testing thing interface.
 * @description This interface is used to store the testing thing.
 */
interface ITestingThing extends IBaseEntity {
    /**
     * @summary The user ID of the creator.
     * @description ID of the user who created the recruitment.
     */
    readonly createdByUserId: DiscordSnowflake
    /**
     * @summary The guild ID.
     * @description ID of the guild for the recruitment.
     */
    readonly guildId: DiscordSnowflake
    /**
     * @summary The role ID.
     * @description ID of the role for the recruitment.
     */
    readonly roleId: DiscordSnowflake
    /**
     * @summary The channel ID.
     * @description ID of the channel for the recruitment.
     */
    readonly channelId: DiscordSnowflake
    /**
     * @summary The channel name.
     * @description Name of the channel for the recruitment.
     */
    readonly channelName: string
    /**
     * @summary The maximum number of participants.
     * @description Maximum number of participants for the recruitment.
     * @remarks If there is no limit, the maximum number of participants will be `null`.
     */
    readonly maxParticipants: number | null
    /**
     * @summary The start date.
     * @description Start date of the recruitment.
     */
    readonly startsAt: Date
    /**
     * @summary The end date.
     * @description End date of the recruitment.
     */
    readonly endsAt: Date
}

export type { ITestingThing }
