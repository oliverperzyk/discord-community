import { timestamp, varchar } from "drizzle-orm/pg-core"
import { baseTable } from "../base/BaseTable"
import { DatabaseConstants } from "../base/DatabaseConstants"
import type { DiscordSnowflake } from "@/oliverperzyk/models/services/discord/base/types/DiscordSnowflake"
import { baseEnum } from "../base/BaseEnum"
import { VerificationRequestStateDataManager } from "../../managers/data/verification/requests/VerificationRequestStateDataManager"
import { VerificationRequestState } from "@/oliverperzyk/models/services/databases/verification/requests/enums/VerificationRequestState"

const verificationRequestStatesEnum = baseEnum(
    "verificationRequestStates",
    VerificationRequestStateDataManager.VALUES_IN_ARRAY,
)

const verificationRequestsTable = baseTable("verificationRequests", {
    userId: varchar("userId", { length: DatabaseConstants.DISCORD_SNOWFLAKE_COLUMN_LENGTH })
        .notNull()
        .$type<DiscordSnowflake>(),
    guildId: varchar("guildId", { length: DatabaseConstants.DISCORD_SNOWFLAKE_COLUMN_LENGTH })
        .notNull()
        .$type<DiscordSnowflake>(),
    comment: varchar("comment", { length: DatabaseConstants.BASE_CONTENT_COLUMN_LENGTH }),
    state: verificationRequestStatesEnum("state")
        .notNull()
        .default(VerificationRequestState.UNOPENED)
        .$type<VerificationRequestState>(),
    openedAt: timestamp("openedAt", { withTimezone: true, mode: "date" }).notNull(),
})

export { verificationRequestStatesEnum, verificationRequestsTable }
