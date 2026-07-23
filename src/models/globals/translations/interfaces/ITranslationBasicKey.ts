import type { TranslationKeyType } from "../enums/TranslationKeyType"

/**
 * @summary Basic translation key.
 * @description A constant translation entry without arguments.
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
