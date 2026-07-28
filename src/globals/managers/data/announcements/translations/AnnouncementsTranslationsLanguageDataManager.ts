import { AnnouncementsTranslationsLanguage } from "@/oliverperzyk/models/services/databases/announcements/translations/enums/AnnouncementsTranslationsLanguage"

/**
 * @summary The data manager for the announcements translations language.
 * @description This class is used to manage the data for the announcements translations language.
 */
class AnnouncementsTranslationsLanguageDataManager {
    /**
     * @summary Private constructor.
     * @description Private constructor to prevent instantiation & inheritance.
     */
    private constructor() {}

    /**
     * @summary The values of the announcements translations language.
     * @description The values of the announcements translations language.
     */
    private static readonly VALUES: ReadonlySet<AnnouncementsTranslationsLanguage> =
        new Set<AnnouncementsTranslationsLanguage>([
            AnnouncementsTranslationsLanguage.POLISH,
            AnnouncementsTranslationsLanguage.ENGLISH,
        ])

    /**
     * @summary The values of the announcements translations language in an array.
     * @description The values of the announcements translations language in an array, used for schema definitions.
     */
    public static readonly VALUES_IN_ARRAY: readonly AnnouncementsTranslationsLanguage[] = Array.from(this.VALUES)

    /**
     * @summary Checks if a value is a valid announcements translations language.
     * @description Checks if a value is a valid announcements translations language.
     * @param value - The value to check.
     * @returns Boolean whether the value is a valid announcements translations language, returned as a type guard.
     */
    public static isAnnouncementsTranslationsLanguage(value: string): value is AnnouncementsTranslationsLanguage {
        return this.VALUES.has(value as AnnouncementsTranslationsLanguage)
    }

    /**
     * @summary Resolves the language.
     * @description Resolves the language, if the language is not valid, it will return the default language.
     * @param language - The language to resolve.
     * @returns The resolved language.
     */
    public static resolveLanguage(language: string): AnnouncementsTranslationsLanguage {
        language = language.toLowerCase().trim()
        if (this.isAnnouncementsTranslationsLanguage(language)) return language
        return AnnouncementsTranslationsLanguage.ENGLISH
    }
}

export { AnnouncementsTranslationsLanguageDataManager }
