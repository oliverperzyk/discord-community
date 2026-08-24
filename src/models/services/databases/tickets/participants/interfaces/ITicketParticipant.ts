import type { DiscordSnowflake } from "@/oliverperzyk/models/services/discord/base/types/DiscordSnowflake"
import type { IBaseEntity } from "../../../base/interfaces/IBaseEntity"
import type { DatabaseIdentifier } from "../../../base/types/DatabaseIdentifier"

/**
 * @summary The ticket participant interface.
 * @description This interface is used to store the ticket participant data.
 */
interface ITicketParticipant extends IBaseEntity {
    /**
     * @summary The ticket ID.
     * @description This is the ID of the ticket the participant is in.
     */
    readonly ticketId: DatabaseIdentifier
    /**
     * @summary The user ID.
     * @description This is the ID of the user who is a participant.
     */
    readonly userId: DiscordSnowflake
    /**
     * @summary The user ID of the user who added the participant.
     * @description This is the ID of the user who added the participant.
     */
    readonly addedByUserId: DiscordSnowflake
}

export type { ITicketParticipant }
