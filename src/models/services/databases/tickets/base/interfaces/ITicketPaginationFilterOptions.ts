import type { DiscordSnowflake } from "@/oliverperzyk/models/services/discord/base/types/DiscordSnowflake"
import type { TicketCategory } from "../enums/TicketCategory"
import type { TicketState } from "../enums/TicketState"

/**
 * @summary The ticket pagination filter options interface.
 * @description This interface is used to filter the tickets by pagination.
 */
interface ITicketPaginationFilterOptions {
    /**
     * @summary The guild ID.
     * @description This is the ID of the guild the tickets are in.
     */
    readonly guildId?: DiscordSnowflake
    /**
     * @summary The user ID of the creator of the tickets.
     * @description This is the ID of the user who created the tickets.
     */
    readonly createdByUserId?: DiscordSnowflake
    /**
     * @summary The category of the tickets.
     * @description This is the category of the tickets.
     */
    readonly category?: TicketCategory
    /**
     * @summary The state of the tickets.
     * @description This is the state of the tickets.
     */
    readonly state?: TicketState
}

export type { ITicketPaginationFilterOptions }
