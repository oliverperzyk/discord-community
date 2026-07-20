import { text, unique, varchar } from "drizzle-orm/pg-core"
import { DatabaseConstants } from "../base/DatabaseConstants"
import type { DatabaseIdentifier } from "@/oliverperzyk/models/services/databases/base/types/DatabaseIdentifier"
import { baseTable } from "../base/BaseTable"
import { announcementsTable } from "./AnnouncementsSchemas"
import { baseEnum } from "../base/BaseEnum"
import { AnnouncementsTranslationsLanguageDataManager } from "../../managers/data/announcements/translations/AnnouncementsTranslationsLanguageDataManager"
import type { AnnouncementsTranslationsLanguage } from "@/oliverperzyk/models/services/databases/announcements/translations/enums/AnnouncementsTranslationsLanguage"

/**
 * @summary The announcements translations language enum.
 * @description This enum is used to store the language for the announcements translations.
 */
const announcementsTranslationsLanguageEnum = baseEnum(
    "announcementsTranslationsLanguage",
    AnnouncementsTranslationsLanguageDataManager.VALUES_IN_ARRAY,
)

/**
 * @summary The announcements translations table schema.
 * @description This table is used to store the announcements translations.
 */
const announcementsTranslationsTable = baseTable(
    "announcementsTranslations",
    {
        announcementId: varchar("announcementId", { length: DatabaseConstants.DATABASE_IDENTIFIER_COLUMN_LENGTH })
            .notNull()
            .references(() => announcementsTable.id)
            .$type<DatabaseIdentifier>(),
        language: announcementsTranslationsLanguageEnum("language")
            .notNull()
            .$type<AnnouncementsTranslationsLanguage>(),
        title: varchar("title", { length: 255 }).notNull(),
        content: text("content").notNull(),
    },
    (table) => [unique("announcementTranslation").on(table.announcementId, table.language)],
)

export { announcementsTranslationsTable }
