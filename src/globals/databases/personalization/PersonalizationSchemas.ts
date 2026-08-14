import { varchar } from "drizzle-orm/pg-core"
import { baseTable } from "../base/BaseTable"
import { DatabaseConstants } from "../base/DatabaseConstants"
import type { DiscordSnowflake } from "@/oliverperzyk/models/services/discord/base/types/DiscordSnowflake"
import { languageEnum } from "../base/shared/LanguageEnum"
import { Language } from "@/oliverperzyk/models/services/databases/base/enums/Language"

/**
 * @summary The personalization language table schema.
 * @description This table is used to store the language of the personalization.
 */
const personalizationTable = baseTable("personalization", {
    id: varchar("id", { length: DatabaseConstants.DISCORD_SNOWFLAKE_COLUMN_LENGTH })
        .notNull()
        .primaryKey()
        .$type<DiscordSnowflake>(),
    language: languageEnum("language").notNull().default(Language.ENGLISH).$type<Language>(),
})

export { personalizationTable }
