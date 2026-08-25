import { Language } from "@/oliverperzyk/models/services/databases/base/enums/Language"
import { Locale } from "discord.js"

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
     * @summary The Discord locales for the languages.
     * @description Maps a language to its Discord locales.
     */
    private static readonly DISCORD_LOCALES: Readonly<Record<Language, Locale[]>> = {
        [Language.ENGLISH]: [Locale.EnglishGB, Locale.EnglishUS],
        [Language.POLISH]: [Locale.Polish],
    }

    /**
     * @summary The values of the language enum.
     * @description The values of the language enum.
     */
    private static readonly VALUES: ReadonlySet<Language> = new Set(Object.keys(this.DISCORD_LOCALES) as Language[])

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
     * @summary Maps a language to its discord.js locale.
     * @description Returns the Discord API locale used for command and UI localizations.
     * @param language - The language to map.
     * @returns The discord.js locale.
     */
    public static resolveDiscordLocales(language: Language): Locale[] {
        return this.DISCORD_LOCALES[language] ?? [Locale.EnglishUS]
    }
}

export { LanguageDataManager }
