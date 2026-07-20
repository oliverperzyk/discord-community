import { check, integer, jsonb, timestamp, varchar } from "drizzle-orm/pg-core"
import { baseTable } from "../base/BaseTable"
import { DatabaseConstants } from "../base/DatabaseConstants"
import type { DiscordSnowflake } from "@/oliverperzyk/models/services/discord/base/types/DiscordSnowflake"
import { GiveawayPrizeType } from "@/oliverperzyk/models/services/databases/giveaways/base/enums/GIveawayPrizeType"
import { baseEnum } from "../base/BaseEnum"
import { GiveawayPrizeTypeDataManager } from "../../managers/data/giveaways/base/GiveawayPrizeTypeDataManager"
import { sql } from "drizzle-orm"

/**
 * @summary The giveaway prize type enum.
 * @description This enum is used to store the prize type for the giveaways.
 */
const giveawayPrizeTypeEnum = baseEnum("giveawayPrizeType", GiveawayPrizeTypeDataManager.VALUES_IN_ARRAY)

/**
 * @summary The giveaways table schema.
 * @description This table is used to store the giveaways.
 */
const giveawaysTable = baseTable(
    "giveaways",
    {
        serverId: varchar("serverId", { length: DatabaseConstants.DISCORD_SNOWFLAKE_COLUMN_LENGTH })
            .notNull()
            .$type<DiscordSnowflake>(),
        messageId: varchar("messageId", { length: DatabaseConstants.DISCORD_SNOWFLAKE_COLUMN_LENGTH })
            .notNull()
            .$type<DiscordSnowflake>(),
        createdBy: varchar("createdBy", { length: DatabaseConstants.DISCORD_SNOWFLAKE_COLUMN_LENGTH })
            .notNull()
            .$type<DiscordSnowflake>(),
        startedAt: timestamp("startedAt").notNull(),
        endedAt: timestamp("endedAt").notNull(),
        winnerCount: integer("winnerCount").notNull(),
        prizeType: giveawayPrizeTypeEnum("prizeType").notNull().$type<GiveawayPrizeType>(),
        additionalInformation: jsonb("additionalInformation").$type<Record<string, unknown> | null>(),
    },
    (table) => [check("winnerCountIsPositive", sql`${table.winnerCount} > 0`)],
)

export { giveawaysTable }
