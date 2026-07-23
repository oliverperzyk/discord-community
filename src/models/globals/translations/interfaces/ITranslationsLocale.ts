import type { TranslationKey } from "../types/TranslationKey"

/**
 * @summary Translations locale file.
 * @description Maps flat translation keys to BASIC or PARAMETER entries for one language.
 */
interface ITranslationsLocale {
    /**
     * @summary Optional JSON schema reference used by editors.
     */
    readonly $schema?: string
    /**
     * @summary Flat map of translation keys.
     */
    readonly [key: string]: TranslationKey | string | undefined
}

export type { ITranslationsLocale }
