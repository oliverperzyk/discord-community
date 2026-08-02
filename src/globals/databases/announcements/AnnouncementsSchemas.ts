import { unique, varchar } from "drizzle-orm/pg-core"
import { baseTable } from "../base/BaseTable"
import type { DiscordSnowflake } from "@/oliverperzyk/models/services/discord/base/types/DiscordSnowflake"
import { DatabaseConstants } from "../base/DatabaseConstants"

/**
 * @summary The announcements table schema.
 * @description This table is used to store the announcements.
 */
const announcementsTable = baseTable(
    "announcements",
    {
        guildId: varchar("guildId", { length: DatabaseConstants.DISCORD_SNOWFLAKE_COLUMN_LENGTH })
            .notNull()
            .$type<DiscordSnowflake>(),
        messageId: varchar("messageId", { length: DatabaseConstants.DISCORD_SNOWFLAKE_COLUMN_LENGTH })
            .notNull()
            .$type<DiscordSnowflake>(),
        createdByUserId: varchar("createdByUserId", { length: DatabaseConstants.DISCORD_SNOWFLAKE_COLUMN_LENGTH })
            .notNull()
            .$type<DiscordSnowflake>(),
    },
    (table) => [unique("announcementMessage").on(table.messageId)],
)

export { announcementsTable }
