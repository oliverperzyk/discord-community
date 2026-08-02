import type { DiscordSnowflake } from "@/oliverperzyk/models/services/discord/base/types/DiscordSnowflake"

/**
 * @summary The announcement pagination filter options interface.
 * @description This interface is used to store the pagination filter options for announcements.
 */
interface IAnnouncementPaginationFilterOptions {
    /**
     * @summary The guild ID.
     * @description The guild ID, the guild where the announcements are posted.
     */
    readonly guildId?: DiscordSnowflake
}

export type { IAnnouncementPaginationFilterOptions }
