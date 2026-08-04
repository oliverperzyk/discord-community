import type { DiscordSnowflake } from "@/oliverperzyk/models/services/discord/base/types/DiscordSnowflake"
import type { DatabaseIdentifier } from "../../../base/types/DatabaseIdentifier"

/**
 * @summary The giveaways participant pagination filter options interface.
 * @description This interface represents the filter options for the giveaways participants pagination.
 */
interface IGiveawaysParticipantPaginationFilterOptions {
    /**
     * @summary The giveaway ID.
     * @description The giveaway ID.
     */
    readonly giveawayId: DatabaseIdentifier
    /**
     * @summary The user ID.
     * @description The user ID.
     */
    readonly userId?: DiscordSnowflake
    /**
     * @summary The winner status.
     * @description The winner status.
     */
    readonly isWinner?: boolean
}

export type { IGiveawaysParticipantPaginationFilterOptions }
