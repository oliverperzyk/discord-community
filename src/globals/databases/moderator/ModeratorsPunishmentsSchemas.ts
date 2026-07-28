import { text, timestamp, varchar } from "drizzle-orm/pg-core"
import { baseTable } from "../base/BaseTable"
import { DatabaseConstants } from "../base/DatabaseConstants"
import { DiscordSnowflake } from "@/oliverperzyk/models/services/discord/base/types/DiscordSnowflake"
import { baseEnum } from "../base/BaseEnum"
import { ModeratorsPunishmentTypeDataManager } from "../../managers/data/moderator/punishments/ModeratorsPunishmentTypeDataManager"
import type { ModeratorsPunishmentType } from "@/oliverperzyk/models/services/databases/moderator/punishments/enums/ModeratorsPunishmentType"

/**
 * @summary The moderators punishments types enum.
 * @description This enum is used to store the type of the moderator's punishment.
 */
const moderatorsPunishmentTypesEnum = baseEnum(
    "moderatorsPunishmentTypes",
    ModeratorsPunishmentTypeDataManager.VALUES_IN_ARRAY,
)

/**
 * @summary The moderators punishments table schema.
 * @description This table is used to store the moderator's punishments.
 */
const moderatorsPunishmentsTable = baseTable("moderatorsPunishments", {
    userId: varchar("userId", { length: DatabaseConstants.DATABASE_IDENTIFIER_COLUMN_LENGTH })
        .notNull()
        .$type<DiscordSnowflake>(),
    guildId: varchar("guildId", { length: DatabaseConstants.DATABASE_IDENTIFIER_COLUMN_LENGTH })
        .notNull()
        .$type<DiscordSnowflake>(),
    type: moderatorsPunishmentTypesEnum("type").notNull().$type<ModeratorsPunishmentType>(),
    comment: text("comment"),
    expiresAt: timestamp("expiresAt", { withTimezone: true, mode: "date" }),
})

export { moderatorsPunishmentTypesEnum, moderatorsPunishmentsTable }
