import { baseEnum } from "../base/BaseEnum"
import { baseTable } from "../base/BaseTable"
import { TestingThingsTranslationsLanguageDataManager } from "../../managers/data/testing/translations/TestingThingsTranslationsLanguageDataManager"
import type { TestingThingsTranslationsLanguage } from "@/oliverperzyk/models/services/databases/testing/translations/enums/TestingThingsTranslationsLanguage"
import { DatabaseConstants } from "../base/DatabaseConstants"
import { testingThingsTable } from "./TestingThingsSchemas"
import { text, varchar } from "drizzle-orm/pg-core"
import type { DatabaseIdentifier } from "@/oliverperzyk/models/services/databases/base/types/DatabaseIdentifier"

/**
 * @summary The enum for the testing things translations languages.
 * @description This enum is used to store the languages for the testing things translations.
 */
const testingThingsTranslationsLanguageEnum = baseEnum(
    "testingThingsTranslationsLanguages",
    TestingThingsTranslationsLanguageDataManager.VALUES_IN_ARRAY,
)

/**
 * @summary The table for the testing things translations.
 * @description This table is used to store the testing things translations.
 */
const testingThingsTranslationsTable = baseTable("testingThingsTranslations", {
    language: testingThingsTranslationsLanguageEnum("language").notNull().$type<TestingThingsTranslationsLanguage>(),
    testingThingId: varchar("testingThingId", { length: DatabaseConstants.DATABASE_IDENTIFIER_COLUMN_LENGTH })
        .notNull()
        .references(() => testingThingsTable.id)
        .$type<DatabaseIdentifier>(),
    title: varchar("title", { length: DatabaseConstants.BASE_CONTENT_COLUMN_LENGTH }).notNull(),
    prize: varchar("prize", { length: DatabaseConstants.BASE_CONTENT_COLUMN_LENGTH }).notNull(),
    description: text("description"),
})

export { testingThingsTranslationsTable }
