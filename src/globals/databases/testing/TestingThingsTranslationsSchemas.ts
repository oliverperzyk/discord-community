import { baseTable } from "../base/BaseTable"
import { languageEnum } from "../base/shared/LanguageEnum"
import type { Language } from "@/oliverperzyk/models/services/databases/base/enums/Language"
import { DatabaseConstants } from "../base/DatabaseConstants"
import { testingThingsTable } from "./TestingThingsSchemas"
import { text, uniqueIndex, varchar } from "drizzle-orm/pg-core"
import type { DatabaseIdentifier } from "@/oliverperzyk/models/services/databases/base/types/DatabaseIdentifier"

/**
 * @summary The table for the testing things translations.
 * @description This table is used to store the testing things translations.
 */
const testingThingsTranslationsTable = baseTable(
    "testingThingsTranslations",
    {
        language: languageEnum("language").notNull().$type<Language>(),
        testingThingId: varchar("testingThingId", { length: DatabaseConstants.DATABASE_IDENTIFIER_COLUMN_LENGTH })
            .notNull()
            .references(() => testingThingsTable.id)
            .$type<DatabaseIdentifier>(),
        title: varchar("title", { length: DatabaseConstants.BASE_CONTENT_COLUMN_LENGTH }).notNull(),
        content: text("content").notNull(),
        prize: varchar("prize", { length: DatabaseConstants.BASE_CONTENT_COLUMN_LENGTH }).notNull(),
    },
    (table) => [uniqueIndex("testingThingTranslation").on(table.testingThingId, table.language)],
)

export { testingThingsTranslationsTable }
