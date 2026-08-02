import { boolean, varchar } from "drizzle-orm/pg-core"
import { baseTable } from "../base/BaseTable"
import { DatabaseConstants } from "../base/DatabaseConstants"
import { DiscordSnowflake } from "@/oliverperzyk/models/services/discord/base/types/DiscordSnowflake"

/**
 * @summary Table for the verification state.
 * @description Table for the verification state, used to store the verification state for the verification process.
 */
const verificationStateTable = baseTable("verification_state", {
    guildId: varchar("guildId", { length: DatabaseConstants.DISCORD_SNOWFLAKE_COLUMN_LENGTH })
        .notNull()
        .unique()
        .$type<DiscordSnowflake>(),
    enabled: boolean("state").notNull().default(false),
})

export { verificationStateTable }
