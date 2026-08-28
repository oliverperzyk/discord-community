import { Language } from "@/oliverperzyk/models/services/databases/base/enums/Language"
import { baseEnum } from "../BaseEnum"

/**
 * @summary The shared language PostgreSQL enum.
 * @description Used by all tables that store a language column.
 * @remarks This must be a hard-coded enumeration as there's a circular dependency between LanguageDataManager and LanguageEnum.
 */
const languageEnum = baseEnum("language", [Language.ENGLISH, Language.POLISH] as const)

export { languageEnum }
