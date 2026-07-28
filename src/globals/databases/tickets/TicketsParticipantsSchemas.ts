import { varchar } from "drizzle-orm/pg-core"
import { baseTable } from "../base/BaseTable"
import { DatabaseConstants } from "../base/DatabaseConstants"
import { ticketsTable } from "./TicketsSchemas"
import type { DatabaseIdentifier } from "@/oliverperzyk/models/services/databases/base/types/DatabaseIdentifier"
import type { DiscordSnowflake } from "@/oliverperzyk/models/services/discord/base/types/DiscordSnowflake"

/**
 * @summary The tickets participants table schema.
 * @description This table is used to store the tickets participants.
 */
const ticketsParticipantsTable = baseTable("ticketsParticipants", {
    ticketId: varchar("ticketId", { length: DatabaseConstants.DATABASE_IDENTIFIER_COLUMN_LENGTH })
        .notNull()
        .references(() => ticketsTable.id)
        .$type<DatabaseIdentifier>(),
    userId: varchar("userId", { length: DatabaseConstants.DISCORD_SNOWFLAKE_COLUMN_LENGTH })
        .notNull()
        .$type<DiscordSnowflake>(),
    addedByUserId: varchar("addedByUserId", { length: DatabaseConstants.DISCORD_SNOWFLAKE_COLUMN_LENGTH })
        .notNull()
        .$type<DiscordSnowflake>(),
})

export { ticketsParticipantsTable }
