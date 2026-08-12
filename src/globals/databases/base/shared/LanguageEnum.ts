import { LanguageDataManager } from "@/oliverperzyk/globals/managers/data/base/LanguageDataManager"
import { baseEnum } from "../BaseEnum"

/**
 * @summary The shared language PostgreSQL enum.
 * @description Used by all tables that store a language column.
 */
const languageEnum = baseEnum("language", LanguageDataManager.VALUES_IN_ARRAY)

export { languageEnum }
