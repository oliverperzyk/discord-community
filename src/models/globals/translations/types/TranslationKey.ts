import type { ITranslationBasicKey } from "../interfaces/ITranslationBasicKey"
import type { ITranslationParameterKey } from "../interfaces/ITranslationParameterKey"

/**
 * @summary Translation key union.
 * @description A locale entry that is either BASIC or PARAMETER.
 */
type TranslationKey = ITranslationBasicKey | ITranslationParameterKey

export type { TranslationKey }
