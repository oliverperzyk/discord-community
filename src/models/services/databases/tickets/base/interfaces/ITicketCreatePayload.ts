import type { DiscordSnowflake } from "@/oliverperzyk/models/services/discord/base/types/DiscordSnowflake"
import type { TicketCategory } from "../enums/TicketCategory"

/**
 * @summary The ticket create payload interface.
 * @description This interface is used to create a ticket.
 */
interface ITicketCreatePayload {
    /**
     * @summary The guild ID.
     * @description This is the ID of the guild the ticket is in.
     */
    readonly guildId: DiscordSnowflake
    /**
     * @summary The channel ID.
     * @description This is the ID of the channel the ticket is in.
     */
    readonly channelId?: DiscordSnowflake
    /**
     * @summary The user ID of the creator of the ticket.
     * @description This is the ID of the user who created the ticket.
     */
    readonly createdByUserId: DiscordSnowflake
    /**
     * @summary The category of the ticket.
     * @description This is the category of the ticket.
     */
    readonly category: TicketCategory
}

export type { ITicketCreatePayload }
