import type { DiscordSnowflake } from "@/oliverperzyk/models/services/discord/base/types/DiscordSnowflake"
import type { DatabaseIdentifier } from "../../../base/types/DatabaseIdentifier"

/**
 * @summary The giveaways participant create payload interface.
 * @description This interface represents the payload for creating a new giveaways participant.
 */
interface IGiveawaysParticipantCreatePayload {
    /**
     * @summary The ID of the giveaway.
     */
    readonly givewayId: DatabaseIdentifier
    /**
     * @summary The ID of the user who is participating in the giveaway.
     */
    readonly userId: DiscordSnowflake
}

export type { IGiveawaysParticipantCreatePayload }
