import type { DiscordSnowflake } from "@/oliverperzyk/models/services/discord/base/types/DiscordSnowflake"

/**
 * @summary The giveaways pagination filter options interface.
 * @description This interface represents the filter options for paginating giveaways.
 */
interface IGiveawayPaginationFilterOptions {
    /**
     * @summary The ID of the guild to filter giveaways by.
     */
    readonly guildId?: DiscordSnowflake
}

export type { IGiveawayPaginationFilterOptions }
