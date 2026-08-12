import { text, uniqueIndex, varchar } from "drizzle-orm/pg-core"
import { DatabaseConstants } from "../base/DatabaseConstants"
import type { DatabaseIdentifier } from "@/oliverperzyk/models/services/databases/base/types/DatabaseIdentifier"
import { baseTable } from "../base/BaseTable"
import { announcementsTable } from "./AnnouncementsSchemas"
import { languageEnum } from "../base/shared/LanguageEnum"
import type { Language } from "@/oliverperzyk/models/services/databases/base/enums/Language"

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
        language: languageEnum("language").notNull().$type<Language>(),
        title: varchar("title", { length: 255 }).notNull(),
        content: text("content").notNull(),
    },
    (table) => [uniqueIndex("announcementTranslation").on(table.announcementId, table.language)],
)

export { announcementsTranslationsTable }
