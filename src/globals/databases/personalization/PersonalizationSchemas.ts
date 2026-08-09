import { varchar } from "drizzle-orm/pg-core"
import { baseTable } from "../base/BaseTable"
import { DatabaseConstants } from "../base/DatabaseConstants"
import type { DiscordSnowflake } from "@/oliverperzyk/models/services/discord/base/types/DiscordSnowflake"
import { baseEnum } from "../base/BaseEnum"
import { PersonalizationLanguageDataManager } from "../../managers/data/personalization/languages/PersonalizationLanguageDataManager"
import type { PersonalizationLanguage } from "@/oliverperzyk/models/services/databases/personalization/languages/enums/PersonalizationLanguage"

/**
 * @summary The personalization language enum.
 * @description This enum is used to store the language of the personalization.
 */
const personalizationLanguageEnum = baseEnum(
    "personalizationLanguage",
    PersonalizationLanguageDataManager.VALUES_IN_ARRAY,
)

/**
 * @summary The personalization language table schema.
 * @description This table is used to store the language of the personalization.
 */
const personalizationTable = baseTable("personalization", {
    id: varchar("id", { length: DatabaseConstants.DISCORD_SNOWFLAKE_COLUMN_LENGTH })
        .notNull()
        .primaryKey()
        .$type<DiscordSnowflake>(),
    language: personalizationLanguageEnum("language").notNull().$type<PersonalizationLanguage>(),
})

export { personalizationTable }
