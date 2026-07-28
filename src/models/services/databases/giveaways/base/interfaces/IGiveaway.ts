import type { DiscordSnowflake } from "@/oliverperzyk/models/services/discord/base/types/DiscordSnowflake"
import type { GiveawayPrizeType } from "../enums/GiveawayPrizeType"
import type { IBaseEntity } from "../../../base/interfaces/IBaseEntity"

/**
 * @summary The giveaway interface.
 * @description This interface is used to store the giveaway.
 */
interface IGiveaway extends IBaseEntity {
    /**
     * @summary The guild ID.
     * @description The guild ID, the guild where the giveaway is posted.
     */
    readonly guildId: DiscordSnowflake
    /**
     * @summary The message ID.
     * @description The message ID, the message that is being announced.
     */
    readonly messageId: DiscordSnowflake
    /**
     * @summary The user ID of the creator.
     * @description The user ID of the creator, the user who created the giveaway.
     */
    readonly createdByUserId: DiscordSnowflake
    /**
     * @summary The starts at.
     * @description The starts at, the date and time when the giveaway starts.
     */
    readonly startsAt: Date
    /**
     * @summary The ends at.
     * @description The ends at, the date and time when the giveaway ends.
     */
    readonly endsAt: Date
    /**
     * @summary The winner count.
     * @description The winner count, the number of winners for the giveaway.
     */
    readonly winnerCount: number
    /**
     * @summary The prize type.
     * @description The prize type, the type of the prize for the giveaway.
     */
    readonly prizeType: GiveawayPrizeType
    /**
     * @summary The already rolled.
     * @description The already rolled, whether the giveaway has already been rolled.
     */
    readonly alreadyRolled: boolean
    /**
     * @summary The additional information.
     * @description The additional information, the additional information for the giveaway, stored as a JSON object.
     * @remarks It'll store, e.g. a role on Discord.
     */
    readonly additionalInformation: Record<string, unknown> | null
}

export type { IGiveaway }
