import { text, uniqueIndex, varchar } from "drizzle-orm/pg-core"
import { baseTable } from "../base/BaseTable"
import { DatabaseConstants } from "../base/DatabaseConstants"
import { giveawaysTable } from "./GiveawaysSchemas"
import type { DatabaseIdentifier } from "@/oliverperzyk/models/services/databases/base/types/DatabaseIdentifier"
import { languageEnum } from "../base/shared/LanguageEnum"
import type { Language } from "@/oliverperzyk/models/services/databases/base/enums/Language"

/**
 * @summary The giveaways translations table schema.
 * @description This table is used to store the giveaways translations.
 */
const giveawaysTranslationsTable = baseTable(
    "giveawaysTranslations",
    {
        giveawayId: varchar("giveawayId", { length: DatabaseConstants.DATABASE_IDENTIFIER_COLUMN_LENGTH })
            .notNull()
            .references(() => giveawaysTable.id)
            .$type<DatabaseIdentifier>(),
        language: languageEnum("language").notNull().$type<Language>(),
        title: varchar("title", { length: DatabaseConstants.BASE_CONTENT_COLUMN_LENGTH }).notNull(),
        content: text("content").notNull(),
        prize: varchar("prize", { length: DatabaseConstants.BASE_CONTENT_COLUMN_LENGTH }).notNull(),
    },
    (table) => [uniqueIndex("giveawayTranslation").on(table.giveawayId, table.language)],
)

export { giveawaysTranslationsTable }
