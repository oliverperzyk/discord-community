import { timestamp, varchar } from "drizzle-orm/pg-core"
import { baseTable } from "../base/BaseTable"
import { DatabaseConstants } from "../base/DatabaseConstants"
import type { DiscordSnowflake } from "@/oliverperzyk/models/services/discord/base/types/DiscordSnowflake"

/**
 * @summary Schema for the testing things table.
 * @description This schema is used to store the testing things.
 */
const testingThingsTable = baseTable("testingThings", {
    createdByUserId: varchar("createdByUserId", { length: DatabaseConstants.DISCORD_SNOWFLAKE_COLUMN_LENGTH })
        .notNull()
        .$type<DiscordSnowflake>(),
    // I might expand this to include other guilds in the future, but for now
    // it's only for the smaller one. It'll be easier to migrate later.
    guildId: varchar("guildId", { length: DatabaseConstants.DISCORD_SNOWFLAKE_COLUMN_LENGTH })
        .notNull()
        .$type<DiscordSnowflake>(),
    roleId: varchar("roleId", { length: DatabaseConstants.DISCORD_SNOWFLAKE_COLUMN_LENGTH })
        .notNull()
        .unique()
        .$type<DiscordSnowflake>(),
    startsAt: timestamp("startsAt", { withTimezone: true, mode: "date" }),
    endsAt: timestamp("endsAt", { withTimezone: true, mode: "date" }),
})

export { testingThingsTable }
