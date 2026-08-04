import { boolean, uniqueIndex, varchar } from "drizzle-orm/pg-core"
import { baseTable } from "../base/BaseTable"
import { DatabaseConstants } from "../base/DatabaseConstants"
import { giveawaysTable } from "./GiveawaysSchemas"
import type { DatabaseIdentifier } from "@/oliverperzyk/models/services/databases/base/types/DatabaseIdentifier"
import type { DiscordSnowflake } from "@/oliverperzyk/models/services/discord/base/types/DiscordSnowflake"

/**
 * @summary The giveaways participants table schema.
 * @description This table stores all participants of all giveaways.
 */
const giveawaysParticipantsTable = baseTable(
    "giveawaysParticipants",
    {
        giveawayId: varchar("giveawayId", { length: DatabaseConstants.DATABASE_IDENTIFIER_COLUMN_LENGTH })
            .notNull()
            .references(() => giveawaysTable.id)
            .$type<DatabaseIdentifier>(),
        userId: varchar("userId", { length: DatabaseConstants.DISCORD_SNOWFLAKE_COLUMN_LENGTH })
            .notNull()
            .$type<DiscordSnowflake>(),
        isWinner: boolean("isWinner").notNull().default(false),
    },
    (table) => [uniqueIndex("giveawayParticipant").on(table.giveawayId, table.userId)],
)

export { giveawaysParticipantsTable }
