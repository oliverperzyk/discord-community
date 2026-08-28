import type { TranslationKeyType } from "../enums/TranslationKeyType"

/**
 * @summary Basic translation key.
 * @description A translation entry with a single text that may include `{{ argument }}` placeholders.
 */
interface ITranslationBasicKey {
    /**
     * @summary Always set to BASIC.
     */
    readonly type: TranslationKeyType.BASIC
    /**
     * @summary The rendered text for this language.
     */
    readonly text: string
}

export type { ITranslationBasicKey }
