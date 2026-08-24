import { text, varchar } from "drizzle-orm/pg-core"
import { baseTable } from "../base/BaseTable"
import { DatabaseConstants } from "../base/DatabaseConstants"
import type { DiscordSnowflake } from "@/oliverperzyk/models/services/discord/base/types/DiscordSnowflake"
import { baseEnum } from "../base/BaseEnum"
import { TicketCategoryDataManager } from "../../managers/data/tickets/base/TicketCategoryDataManager"
import type { TicketCategory } from "@/oliverperzyk/models/services/databases/tickets/base/enums/TicketCategory"
import { TicketState } from "@/oliverperzyk/models/services/databases/tickets/base/enums/TicketState"
import { TicketStateDataManager } from "../../managers/data/tickets/base/TicketStateDataManager"

/**
 * @summary The tickets categories enum.
 * @description This enum is used to store the category of the ticket.
 */
const ticketsCategoriesEnum = baseEnum("ticketsCategories", TicketCategoryDataManager.VALUES_IN_ARRAY)

/**
 * @summary The tickets states enum.
 * @description This enum is used to store the state of the ticket.
 */
const ticketsStatesEnum = baseEnum("ticketsStates", TicketStateDataManager.VALUES_IN_ARRAY)

/**
 * @summary The tickets table schema.
 * @description This table is used to store the tickets.
 */
const ticketsTable = baseTable("tickets", {
    guildId: varchar("guildId", { length: DatabaseConstants.DISCORD_SNOWFLAKE_COLUMN_LENGTH })
        .notNull()
        .$type<DiscordSnowflake>(),
    channelId: varchar("channelId", {
        length: DatabaseConstants.DISCORD_SNOWFLAKE_COLUMN_LENGTH,
    }).$type<DiscordSnowflake | null>(),
    createdByUserId: varchar("createdByUserId", { length: DatabaseConstants.DISCORD_SNOWFLAKE_COLUMN_LENGTH })
        .notNull()
        .$type<DiscordSnowflake>(),
    comment: text("comment"),
    category: ticketsCategoriesEnum("category").notNull().$type<TicketCategory>(),
    state: ticketsStatesEnum("state").notNull().default(TicketState.OPEN).$type<TicketState>(),
})

export { ticketsCategoriesEnum, ticketsStatesEnum, ticketsTable }
