import type { DiscordSnowflake } from "@/oliverperzyk/models/services/discord/base/types/DiscordSnowflake"
import type { IBaseEntity } from "../../../base/interfaces/IBaseEntity"
import type { TicketCategory } from "../enums/TicketCategory"
import type { TicketState } from "../enums/TicketState"

/**
 * @summary The ticket interface.
 * @description This interface is used to store the ticket data.
 */
interface ITicket extends IBaseEntity {
    /**
     * @summary The guild ID.
     * @description This is the ID of the guild the ticket is in.
     */
    readonly guildId: DiscordSnowflake
    /**
     * @summary The channel ID.
     * @description This is the ID of the channel the ticket is in.
     */
    readonly channelId: DiscordSnowflake | null
    /**
     * @summary The user ID of the creator of the ticket.
     * @description This is the ID of the user who created the ticket.
     */
    readonly createdByUserId: DiscordSnowflake
    /**
     * @summary The comment of the ticket.
     * @description This is the comment of the ticket.
     */
    readonly comment: string | null
    /**
     * @summary The category of the ticket.
     * @description This is the category of the ticket.
     */
    readonly category: TicketCategory
    /**
     * @summary The state of the ticket.
     * @description This is the state of the ticket.
     */
    readonly state: TicketState
}

export type { ITicket }
