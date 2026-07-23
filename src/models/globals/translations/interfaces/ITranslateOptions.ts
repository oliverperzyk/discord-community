import type { LanguageCode } from "../types/LanguageCode"
import type { TranslationArgumentValue } from "../types/TranslationArgumentValue"

/**
 * @summary Options for translating a key.
 * @description Describes which key to resolve, in which language, and with which argument data.
 */
interface ITranslateOptions {
    /**
     * @summary The flat translation key to resolve.
     */
    readonly key: string
    /**
     * @summary The language to translate into.
     */
    readonly language: LanguageCode | string
    /**
     * @summary Optional argument values for PARAMETER translations.
     */
    readonly data?: Readonly<Record<string, TranslationArgumentValue>>
}

export type { ITranslateOptions }
