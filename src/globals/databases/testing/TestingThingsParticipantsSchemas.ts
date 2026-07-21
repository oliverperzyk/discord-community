import { uniqueIndex, varchar } from "drizzle-orm/pg-core"
import { baseTable } from "../base/BaseTable"
import { DatabaseConstants } from "../base/DatabaseConstants"
import { testingThingsTable } from "./TestingThingsSchemas"
import type { DatabaseIdentifier } from "@/oliverperzyk/models/services/databases/base/types/DatabaseIdentifier"
import type { DiscordSnowflake } from "@/oliverperzyk/models/services/discord/base/types/DiscordSnowflake"

/**
 * @summary Schema for testing things' participants.
 * @description This schema is used to store testing things' participants.
 */
const testingThingsParticipantsTable = baseTable(
    "testingThingsParticipants",
    {
        testingThingId: varchar("testingThingId", { length: DatabaseConstants.DATABASE_IDENTIFIER_COLUMN_LENGTH })
            .notNull()
            .references(() => testingThingsTable.id)
            .$type<DatabaseIdentifier>(),
        userId: varchar("userId", { length: DatabaseConstants.DISCORD_SNOWFLAKE_COLUMN_LENGTH })
            .notNull()
            .$type<DiscordSnowflake>(),
    },
    (table) => [uniqueIndex("testingThingParticipant").on(table.testingThingId, table.userId)],
)

export { testingThingsParticipantsTable }
