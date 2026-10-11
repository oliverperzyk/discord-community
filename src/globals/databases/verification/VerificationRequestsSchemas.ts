import { check, uniqueIndex, varchar } from "drizzle-orm/pg-core"
import { baseTable } from "../base/BaseTable"
import { DatabaseConstants } from "../base/DatabaseConstants"
import type { DiscordSnowflake } from "@/oliverperzyk/models/services/discord/base/types/DiscordSnowflake"
import { baseEnum } from "../base/BaseEnum"
import { VerificationRequestStateDataManager } from "../../managers/data/verification/requests/VerificationRequestStateDataManager"
import { VerificationRequestState } from "@/oliverperzyk/models/services/databases/verification/requests/enums/VerificationRequestState"
import { sql } from "drizzle-orm"

/**
 * @summary The verification request states enum.
 * @description This enum is used to store the state of the verification request.
 */
const verificationRequestStatesEnum = baseEnum(
    "verificationRequestStates",
    VerificationRequestStateDataManager.VALUES_IN_ARRAY,
)

/**
 * @summary The verification requests table schema.
 * @description This table is used to store the verification requests.
 */
const verificationRequestsTable = baseTable(
    "verificationRequests",
    {
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
        moderatorComment: varchar("moderatorComment", { length: DatabaseConstants.BASE_CONTENT_COLUMN_LENGTH }),
        reviewedByUserId: varchar("reviewedByUserId", {
            length: DatabaseConstants.DISCORD_SNOWFLAKE_COLUMN_LENGTH,
        }).$type<DiscordSnowflake>(),
    },
    (table) => [
        uniqueIndex("verificationRequest").on(table.userId, table.guildId),
        check(
            "stateCheck",
            sql`(
                ${table.state} = ${sql.raw(`'${VerificationRequestState.UNOPENED}'`)}
                    AND ${table.reviewedByUserId} IS NULL
            ) OR (
                ${table.state} <> ${sql.raw(`'${VerificationRequestState.UNOPENED}'`)}
                    AND ${table.reviewedByUserId} IS NOT NULL
            )`,
        ),
    ],
)

export { verificationRequestStatesEnum, verificationRequestsTable }
