import type { DiscordSnowflake } from "@/oliverperzyk/models/services/discord/base/types/DiscordSnowflake"
import type { DatabaseIdentifier } from "../../../base/types/DatabaseIdentifier"

/**
 * @summary The giveaways participant interface.
 * @description This interface represents a participant in a giveaway.
 */
interface IGiveawaysParticipant {
    /**
     * @summary The ID of the giveaway.
     */
    readonly givewayId: DatabaseIdentifier
    /**
     * @summary The ID of the user who is participating in the giveaway.
     */
    readonly userId: DiscordSnowflake
    /**
     * @summary Whether the user is a winner of the giveaway.
     */
    readonly isWinner: boolean
}

export type { IGiveawaysParticipant }
