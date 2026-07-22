import { text, varchar } from "drizzle-orm/pg-core"
import { baseTable } from "../base/BaseTable"
import { DatabaseConstants } from "../base/DatabaseConstants"
import type { DiscordSnowflake } from "@/oliverperzyk/models/services/discord/base/types/DiscordSnowflake"
import { baseEnum } from "../base/BaseEnum"
import { TicketCategoryDataManager } from "../../managers/data/tickets/base/TicketCategoryDataManager"
import type { TicketCategory } from "@/oliverperzyk/models/services/databases/tickets/base/enums/TicketCategory"
import { TicketState } from "@/oliverperzyk/models/services/databases/tickets/base/enums/TicketState"
import { TicketStateDataManager } from "../../managers/data/tickets/base/TicketStateDataManager"

const ticketsCategoriesEnum = baseEnum("ticketsCategories", TicketCategoryDataManager.VALUES_IN_ARRAY)
const ticketsStatesEnum = baseEnum("ticketsStates", TicketStateDataManager.VALUES_IN_ARRAY)

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
    comment: text("comment").notNull(),
    category: ticketsCategoriesEnum("category").notNull().$type<TicketCategory>(),
    state: ticketsStatesEnum("state").notNull().default(TicketState.OPEN).$type<TicketState>(),
})

export { ticketsCategoriesEnum, ticketsStatesEnum, ticketsTable }
