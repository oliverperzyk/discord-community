import type { DiscordSnowflake } from "../../../../discord/base/types/DiscordSnowflake"

/**
 * @summary The announcement create payload interface.
 * @description This interface is used to create an announcement.
 */
interface IAnnouncementCreatePayload {
    /**
     * @summary The guild ID.
     * @description The guild ID, the guild where the announcement is posted.
     */
    readonly guildId: DiscordSnowflake
    /**
     * @summary The message ID.
     * @description The message ID, the message that is being announced.
     */
    readonly messageId: DiscordSnowflake
    /**
     * @summary The user ID of the creator.
     * @description The user ID of the creator, the user who created the announcement.
     */
    readonly createdByUserId: DiscordSnowflake
}

export type { IAnnouncementCreatePayload }
