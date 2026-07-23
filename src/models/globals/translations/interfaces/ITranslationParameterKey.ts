import type { TranslationKeyType } from "../enums/TranslationKeyType"
import type { ITranslationParameter } from "./ITranslationParameter"
import type { ITranslationParameterTexts } from "./ITranslationParameterTexts"

/**
 * @summary Parameter translation key.
 * @description A translation entry that accepts arguments and plural forms.
 */
interface ITranslationParameterKey {
    /**
     * @summary Always set to PARAMETER.
     */
    readonly type: TranslationKeyType.PARAMETER
    /**
     * @summary Plural forms of the translated text.
     */
    readonly texts: ITranslationParameterTexts
    /**
     * @summary Named arguments that must be provided when translating.
     */
    readonly arguments: Readonly<Record<string, ITranslationParameter>>
}

export type { ITranslationParameterKey }
