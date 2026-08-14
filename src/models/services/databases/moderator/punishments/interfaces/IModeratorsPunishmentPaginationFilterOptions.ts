import type { DiscordSnowflake } from "@/oliverperzyk/models/services/discord/base/types/DiscordSnowflake"
import type { ModeratorsPunishmentType } from "../enums/ModeratorsPunishmentType"

/**
 * @summary The moderators punishment pagination filter options interface.
 * @description This interface is used to store the pagination filter options for moderators punishments.
 */
interface IModeratorsPunishmentPaginationFilterOptions {
    /**
     * @summary The guild ID.
     * @description The guild ID of the guild where the punishments are applied.
     */
    readonly guildId?: DiscordSnowflake
    /**
     * @summary The user ID.
     * @description The user ID of the user that is being punished.
     */
    readonly userId?: DiscordSnowflake
    /**
     * @summary The type.
     * @description The type of the punishment.
     */
    readonly type?: ModeratorsPunishmentType
}

export type { IModeratorsPunishmentPaginationFilterOptions }
