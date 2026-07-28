import { GiveawaysTranslationsLanguage } from "@/oliverperzyk/models/services/databases/giveaways/translations/enums/GiveawaysTranslationsLanguage"

/**
 * @summary The data manager for the giveways translations language.
 * @description This class is used to manage the data for the giveways translations language.
 */
class GiveawaysTranslationsLanguageDataManager {
    /**
     * @summary Private constructor.
     * @description Private constructor to prevent instantiation & inheritance.
     */
    private constructor() {}

    /**
     * @summary The values of the giveways translations language.
     * @description The values of the giveways translations language.
     */
    private static readonly VALUES: ReadonlySet<GiveawaysTranslationsLanguage> = new Set<GiveawaysTranslationsLanguage>(
        [GiveawaysTranslationsLanguage.POLISH, GiveawaysTranslationsLanguage.ENGLISH],
    )

    /**
     * @summary The values of the giveways translations language in an array.
     * @description The values of the giveways translations language in an array, used for schema definitions.
     */
    public static readonly VALUES_IN_ARRAY: readonly GiveawaysTranslationsLanguage[] = Array.from(this.VALUES)

    /**
     * @summary Checks if a value is a valid giveways translations language.
     * @description Checks if a value is a valid giveways translations language.
     * @param value - The value to check.
     * @returns Boolean whether the value is a valid giveways translations language, returned as a type guard.
     */
    public static isGiveawaysTranslationsLanguage(value: string): value is GiveawaysTranslationsLanguage {
        return this.VALUES.has(value as GiveawaysTranslationsLanguage)
    }

    /**
     * @summary Resolves the language.
     * @description Resolves the language, if the language is not valid, it will return the default language.
     * @param language - The language to resolve.
     * @returns The resolved language.
     */
    public static resolveLanguage(language: string): GiveawaysTranslationsLanguage {
        language = language.toLowerCase().trim()
        if (this.isGiveawaysTranslationsLanguage(language)) return language
        return GiveawaysTranslationsLanguage.ENGLISH
    }
}

export { GiveawaysTranslationsLanguageDataManager }
