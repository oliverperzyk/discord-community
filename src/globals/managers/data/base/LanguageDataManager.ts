import { Language } from "@/oliverperzyk/models/services/databases/base/enums/Language"

/**
 * @summary The data manager for languages.
 * @description This class is used to manage shared language values.
 */
class LanguageDataManager {
    /**
     * @summary Private constructor.
     * @description Prevents instantiation & inheritance.
     */
    private constructor() {}

    /**
     * @summary The values of the language enum.
     * @description The values of the language enum.
     */
    private static readonly VALUES: ReadonlySet<Language> = new Set<Language>([Language.POLISH, Language.ENGLISH])

    /**
     * @summary Locale file codes keyed by language.
     * @description Maps database language values to locale file / BCP-47 codes.
     */
    private static readonly LOCALE_CODES: ReadonlyMap<Language, "en" | "pl"> = new Map<Language, "en" | "pl">([
        [Language.ENGLISH, "en"],
        [Language.POLISH, "pl"],
    ])

    /**
     * @summary The values of the language enum in an array.
     * @description The values of the language enum in an array, used for schema definitions.
     */
    public static readonly VALUES_IN_ARRAY: readonly Language[] = Array.from(this.VALUES)

    /**
     * @summary Checks if a value is a valid language.
     * @description Checks if a value is a valid language.
     * @param value - The value to check.
     * @returns Boolean whether the value is a valid language, returned as a type guard.
     */
    public static isLanguage(value: string): value is Language {
        return this.VALUES.has(value as Language)
    }

    /**
     * @summary Resolves the language.
     * @description Resolves the language from a language value or BCP-47 tag; invalid input falls back to English.
     * @param language - The language to resolve.
     * @returns The resolved language.
     */
    public static resolveLanguage(language: string): Language {
        const baseCode: string = language.trim().split("-")[0] ?? ""
        const normalized: string = baseCode.toUpperCase()
        if (this.isLanguage(normalized)) return normalized
        return Language.ENGLISH
    }

    /**
     * @summary Maps a language to its locale file code.
     * @description Returns the lowercase locale code used for locale files and Intl.PluralRules.
     * @param language - The language to map.
     * @returns The locale file code.
     */
    public static toLocaleCode(language: Language): "en" | "pl" {
        return this.LOCALE_CODES.get(language) ?? "en"
    }
}

export { LanguageDataManager }
