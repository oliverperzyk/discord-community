import { text, unique, varchar } from "drizzle-orm/pg-core"
import { baseTable } from "../base/BaseTable"
import { DatabaseConstants } from "../base/DatabaseConstants"
import { giveawaysTable } from "./GiveawaysSchemas"
import type { DatabaseIdentifier } from "@/oliverperzyk/models/services/databases/base/types/DatabaseIdentifier"
import { baseEnum } from "../base/BaseEnum"
import { GiveawaysTranslationsLanguageDataManager } from "../../managers/data/giveaways/translations/GiveawaysTranslationsLanguageDataManager"
import type { GiveawaysTranslationsLanguage } from "@/oliverperzyk/models/services/databases/giveaways/translations/enums/GiveawaysTranslationsLanguage"

const giveawaysTranslationsLanguageEnum = baseEnum(
    "giveawaysTranslationsLanguages",
    GiveawaysTranslationsLanguageDataManager.VALUES_IN_ARRAY,
)

const giveawayTranslationsTable = baseTable(
    "giveawaysTranslations",
    {
        giveawayId: varchar("giveawayId", { length: DatabaseConstants.DATABASE_IDENTIFIER_COLUMN_LENGTH })
            .notNull()
            .references(() => giveawaysTable.id)
            .$type<DatabaseIdentifier>(),
        language: giveawaysTranslationsLanguageEnum().notNull().$type<GiveawaysTranslationsLanguage>(),
        title: varchar("title", { length: DatabaseConstants.BASE_CONTENT_COLUMN_LENGTH }).notNull(),
        prize: varchar("prize", { length: DatabaseConstants.BASE_CONTENT_COLUMN_LENGTH }).notNull(),
        description: text("description"),
    },
    (table) => [unique("giveawayTranslation").on(table.giveawayId, table.language)],
)

export { giveawaysTranslationsLanguageEnum, giveawayTranslationsTable }
