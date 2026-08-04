import type { DiscordSnowflake } from "@/oliverperzyk/models/services/discord/base/types/DiscordSnowflake"
import type { DatabaseIdentifier } from "../../../base/types/DatabaseIdentifier"
import type { IBaseEntity } from "../../../base/interfaces/IBaseEntity"

/**
 * @summary The giveaways participant interface.
 * @description This interface represents a participant in a giveaway.
 */
interface IGiveawaysParticipant extends IBaseEntity {
    /**
     * @summary The ID of the giveaway.
     */
    readonly giveawayId: DatabaseIdentifier
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
