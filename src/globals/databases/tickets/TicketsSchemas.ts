import { text, varchar } from "drizzle-orm/pg-core"
import { baseTable } from "../base/BaseTable"
import { DatabaseConstants } from "../base/DatabaseConstants"
import { DiscordSnowflake } from "@/oliverperzyk/models/services/discord/base/types/DiscordSnowflake"
import { baseEnum } from "../base/BaseEnum"
import { TicketCategoryDataManager } from "../../managers/data/tickets/base/TicketCategoryDataManager"
import type { TicketCategory } from "@/oliverperzyk/models/services/databases/tickets/base/enums/TicketCategory"

const ticketCategoriesEnum = baseEnum("ticketsCategories", TicketCategoryDataManager.VALUES_IN_ARRAY)

const ticketsTable = baseTable("tickets", {
    createdByUserId: varchar("createdByUserId", { length: DatabaseConstants.DISCORD_SNOWFLAKE_COLUMN_LENGTH })
        .notNull()
        .$type<DiscordSnowflake>(),
    comment: text("comment").notNull(),
    category: ticketCategoriesEnum("category").notNull().$type<TicketCategory>(),
})

export { ticketsTable }
